import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PLATFORM_ROUTING_VALUES } from '@core/constants/riot';

import { RiotService } from '@core/services/riot.service';

import { SummonerApiResponse } from '@interfaces/riot/summoner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private riotService: RiotService) {
    this.riotService.getLastDDragonVersion().subscribe(version => { this.version = version[0] });
  }

  version: string = '';

  serverKeys = Object.keys(PLATFORM_ROUTING_VALUES);

  summoner?: SummonerApiResponse;

  searchForm = new FormGroup({
    summonerName: new FormControl('', [Validators.required]),
    server: new FormControl(this.serverKeys[4], [Validators.required])
  });

  onSubmit(): void {
    const summonerName = this.searchForm.value.summonerName;
    const server = this.searchForm.value.server;

    if (!summonerName || !server) return;

    const serverURL = PLATFORM_ROUTING_VALUES[server as keyof typeof PLATFORM_ROUTING_VALUES];

    this.riotService.summonerByName(summonerName, serverURL).subscribe(summoner => this.summoner = summoner);
  }
}
