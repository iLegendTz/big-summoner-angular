import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SummonerApiResponse } from '@interfaces/riot/summoner';

import { DDRAGON_URL } from '@core/constants/riot';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RiotService {
  readonly api_url = environment.api_url;

  constructor(private http: HttpClient) { }

  getLastDDragonVersion(): Observable<string[]> {
    return this.http.get<string[]>(`${DDRAGON_URL}/api/versions.json`);
  }

  summonerByName(summonerName: string, server: string): Observable<SummonerApiResponse> {
    return this.http.get<SummonerApiResponse>(`${this.api_url}/lol/summoner?summonerName=${summonerName}&server=${server}`);
  }
}
