import { Injectable } from '@angular/core';

export interface FactionData {
    ranks: string[];
    squads: string[];
}

const factionConfig: { [fid: string]: FactionData } = require('../config/factions.yml');

@Injectable()
export class FactionService {
    constructor() {}

    getFaction(fid: string): FactionData {
        return factionConfig[fid];
    }

    getRanks(fid: string) {
        return factionConfig[fid].ranks;
    }

    getSquads(fid: string) {
        return factionConfig[fid].squads;
    }
}
