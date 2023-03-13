import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const spotifyApi = createApi({
	reducerPath: "spotifyApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://api.spotify.com/v1"
	}),
	endpoints: (builder) => ({
		getTrack: builder.query({
			query: ({value = "", accessCode, offset = 0}) => ({
				url: `/search?q=${value}&type=track%2Calbum%2Cplaylist%2Cartist&limit=10&offset=${offset}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessCode}`
				}
			})
		}),
		checkTrackExist: builder.query({
			query: ({id = "", token}) => ({
				url: `https://api.spotify.com/v1/me/tracks/contains?ids=${id}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		addTrackFavorite: builder.query({
			query: ({id, token}) => ({
				url: `https://api.spotify.com/v1/me/tracks?ids=${id}`,
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		removeTrackFavorite: builder.query({
			query: ({id, token}) => ({
				url: `https://api.spotify.com/v1/me/tracks?ids=${id}`,
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		trackFavoriteList: builder.query({
			query: (token) => ({
				url: `https://api.spotify.com/v1/me/tracks`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		})
	})
});
export const {useGetTrackQuery, useCheckTrackExistQuery, useAddTrackFavoriteQuery, useRemoveTrackFavoriteQuery, useTrackFavoriteListQuery} = spotifyApi;
