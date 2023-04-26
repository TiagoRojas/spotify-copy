import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const spotifyApi = createApi({
	reducerPath: "spotifyApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://api.spotify.com/v1"
	}),
	endpoints: (builder) => ({
		getTrack: builder.query({
			query: ({value = "", token, offset = 0}) => ({
				url: `/search?q=${value}&type=track%2Calbum%2Cplaylist%2Cartist&limit=21&offset=${offset}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		getAlbum: builder.query({
			query: ({id, token}) => ({
				url: `/albums/${id}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		checkTrackExist: builder.query({
			query: ({id = [], token}) => ({
				url: `/me/tracks/contains?ids=${id.toString()}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		addTrackFavorite: builder.query({
			query: ({id, token}) => ({
				url: `/me/tracks?ids=${id}`,
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		removeTrackFavorite: builder.query({
			query: ({id, token}) => ({
				url: `/me/tracks?ids=${id}`,
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		getFavoriteTracks: builder.query({
			query: ({token, offset}) => ({
				url: `/me/tracks?limit=25&offset=${offset}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		}),
		getNewReleases: builder.query({
			query: ({token}) => ({
				url: `/browse/new-releases`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				}
			})
		})
	})
});
export const {
	useLazyGetTrackQuery,
	useLazyGetAlbumQuery,
	useCheckTrackExistQuery,
	useLazyAddTrackFavoriteQuery,
	useLazyRemoveTrackFavoriteQuery,
	useLazyGetFavoriteTracksQuery,
	useLazyGetNewReleasesQuery
} = spotifyApi;
