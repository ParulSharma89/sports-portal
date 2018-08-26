import { Component, Input, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Player } from '../_models/player';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-view-player',
    templateUrl: 'viewPlayer.component.html',
    styleUrls: ['viewPlayer.component.css']
})

export class ViewPlayerComponent implements OnInit {
    @Input() player: Player;
    constructor() {

    }

    ngOnInit() {
        console.log('player');
        console.log(this.player);
    }

}