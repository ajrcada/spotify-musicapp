import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';

import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {

  favouritesList: Array<any> = [];

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient) { }  

  getNewReleases(): Observable<any> {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<any>("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": `Bearer ${token}` } });
      }));
  }

  getArtistById(id): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
    }));
  }

  getAlbumsByArtistId(id): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      // NOTE: Important to include the query parameters include_groups and limit here, to show the maximum amount of albums on one page
      return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`, { headers: { "Authorization": `Bearer ${token}` } })
    })); 
  }

  getAlbumById(id): Observable<any> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/albums/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
    })); 
  }

  searchArtists(searchString): Observable<any>{
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<any>(`https://api.spotify.com/v1/search?q=${searchString}&type=artist&limit=50`, { headers: { "Authorization": `Bearer ${token}` } })
    })); 
  }

  addToFavourites(id): boolean{
    if(id && this.favouritesList.length < 50){
      this.favouritesList.push(id);
      return true;
    }else{
      return false;
    }
  }

  removeFromFavourites(id): Observable<any>{
    let indexOfId = this.favouritesList.indexOf(id);
    if (indexOfId > -1) {
      this.favouritesList.splice(indexOfId, 1);
    }
    return this.getFavourites();
    
  }

  getFavourites(): Observable<any>{
    if(this.favouritesList.length > 0){
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<any>(`https://api.spotify.com/v1/tracks?ids=${this.favouritesList.join()}`, { headers: { "Authorization": `Bearer ${token}` } })
      })); 
    }else{
      return new Observable(o=>{o.next([])});
    }
   
    
  }



}
