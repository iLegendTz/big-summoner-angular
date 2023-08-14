import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Message } from 'primeng/api';

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

  loading: boolean = false;

  version: string = '';

  serverKeys = Object.keys(PLATFORM_ROUTING_VALUES);

  summoner: SummonerApiResponse | undefined;

  errorMessage: Message[] | undefined;

  searchForm = new FormGroup({
    summonerName: new FormControl('chibililyyyyyy', [Validators.required]),
    server: new FormControl(this.serverKeys[4], [Validators.required]),
  });

  onSubmit(): void {
    this.loading = true;
    const summonerName = this.searchForm.value.summonerName;
    const server = this.searchForm.value.server;

    if (!summonerName || !server) return;

    const serverURL = PLATFORM_ROUTING_VALUES[server as keyof typeof PLATFORM_ROUTING_VALUES];


    this.riotService.summonerByName(summonerName, serverURL).subscribe(
      {
        next: (summoner) => {
          this.errorMessage = undefined;
          this.summoner = summoner;
          this.loading = false;
        },
        error: (err) => {
          const { message } = err.error;
          if (err.status === 404) {
            this.errorMessage = [{ severity: 'error', summary: 'No encontrado', detail: `${message}` }];
          } else {
            this.errorMessage = [{ severity: 'error', summary: 'Error', detail: `${message}` }];
          }

          this.loading = false;
        }
      }
    );
  }
}
