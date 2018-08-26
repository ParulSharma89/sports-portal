import { Component, Input } from '@angular/core';
import { Player } from '../_models/player';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-edit-player',
    templateUrl: 'editPlayer.component.html',
    styleUrls: ['editPlayer.component.css']
})

export class EditPlayerComponent {
    @Input() player: Player;
    constructor() {

    }
}