import { Component } from '@angular/core';
import { User } from '../_models/user';
import { Player } from '../_models/player';
import { first } from 'rxjs/operators';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { ViewPlayerComponent } from '../player/viewPlayer.component';
import { EditPlayerComponent } from '../player/editPlayer.component';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent {
    currentUser: User;
    playerData: Array<Player>;
    source: any;
    dataAdapter: any;
    countryTreeSource: any;
    playerRoleTreeSource: any;
    selectedPlayer: any;
    
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.playerData = JSON.parse(localStorage.getItem('playerDetails'));
        this.source = {
        datatype: 'json',
        datafields: [
            { name: 'id' },
            { name: 'name' },
            { name: 'country' },
            { name: 'playerRole' }
        ],
        id: 'id',
        localdata: this.playerData
    };
    // create data adapter & perform Data Binding.
    this.dataAdapter = new jqx.dataAdapter(this.source, { autoBind: true });
    this.countryTreeSource = this.dataAdapter.getGroupedRecords(['country'], 'items', 'label', [{ name: 'name', map: 'label' }]);
    this.playerRoleTreeSource = this.dataAdapter.getGroupedRecords(['playerRole'], 'items', 'label', [{ name: 'name', map: 'label' }]);
    }

    leftLayout: any[] = this.generateLeftLayout();
    centerLayout: any[] = this.generateCenterLayout();
    rightLayout: any[] = this.generateRightLayout();

    generateLeftLayout(): any[] {
        let leftLayout = [
            {
                type: 'layoutGroup',
                orientation: 'horizontal',
                items: [{
                    type: 'tabbedGroup',
                    width: '100%',
                    allowPin: false,
                    items: [
                        {
                            type: 'layoutPanel',
                            title: 'Country',
                            contentContainer: 'CountryPanel',
                            initContent: () => {
                                var myCountryTree: jqwidgets.jqxTree = jqwidgets.createInstance('#countryTree', 'jqxTree', { theme: 'material', source: this.countryTreeSource });
                                var allPlayers = JSON.parse(localStorage.getItem('playerDetails'));

                                myCountryTree.addEventHandler('select', function(event) {
                                    let item = myCountryTree.getItem(event.args.element);
                                    myCountryTree.selectItem(item);
                                    if (item !== null) {
                                        let matchedPlayers = allPlayers.filter(player => {
                                           return player.id === item.element.id;
                                        });
                                        this.selectedPlayer = matchedPlayers.length ? matchedPlayers[0] : null;
                                        localStorage.setItem('selectedPlayer', JSON.stringify(this.selectedPlayer));
                                    }
                                });

                                var myCountryMenu: jqwidgets.jqxMenu = jqwidgets.createInstance('#countryMenu', 'jqxMenu', { theme: 'material', width: 120, height: 28, autoOpenPopup: false, mode: 'popup' });
                                myCountryMenu.addEventHandler('itemclick', function(event) {
                                    let selectedItem = null;
                                    selectedItem = myCountryTree.getSelectedItem();
                                    if (selectedItem !== null) {
                                        myCountryTree.removeItem(selectedItem.element);
                                        for (let i = 0; i < allPlayers.length; i++) {
                                            let player = allPlayers[i];
                                            if (player.id === selectedItem.id) {
                                                // delete player
                                                allPlayers.splice(i, 1);
                                                localStorage.setItem('playerDetails', JSON.stringify(allPlayers));
                                                break;
                                            }
                                        }
                                    }
                                });

                                if (this.currentUser.username === 'Admin') {
                                    // open the context menu when the user presses the mouse right button.
                                    myCountryTree.addEventHandler('contextmenu', function(event) {
                                        event.preventDefault();
                                        if ((event.target).classList.contains('jqx-tree-item')) {
                                            let scrollTop = window.scrollY;
                                            let scrollLeft = window.scrollX;
                                            myCountryMenu.open(event.clientX + 5 + scrollLeft, event.clientY + 5 + scrollTop);
                                            return false;
                                        } else {
                                            myCountryMenu.close();
                                        }
                                    });
                                } 
                            }
                        },
                        {
                            type: 'layoutPanel',
                            title: 'Player Role',
                            contentContainer: 'PlayerRolePanel',
                            initContent: () => {
                                var myPlayerRoleTree: jqwidgets.jqxTree = jqwidgets.createInstance('#playerRoleTree', 'jqxTree', { theme: 'material', source: this.playerRoleTreeSource });
                                var allPlayers = JSON.parse(localStorage.getItem('playerDetails'));

                                myPlayerRoleTree.addEventHandler('select', function(event) {
                                   let item = myPlayerRoleTree.getItem(event.args.element);
                                    myPlayerRoleTree.selectItem(item);
                                    if (item !== null) {
                                        let matchedPlayers = allPlayers.filter(player => {
                                           return player.id === item.element.id;
                                        });
                                        this.selectedPlayer = matchedPlayers.length ? matchedPlayers[0] : null;
                                    }    
                                });

                                var myPlayerRoleMenu: jqwidgets.jqxMenu = jqwidgets.createInstance('#playerRoleMenu', 'jqxMenu', { theme: 'material', width: 120, height: 28, autoOpenPopup: false, mode: 'popup' });
                                myPlayerRoleMenu.addEventHandler('itemclick', function(event) {
                                    let selectedItem = null;
                                    selectedItem = myPlayerRoleTree.getSelectedItem();
                                    if (selectedItem !== null) {
                                        myPlayerRoleTree.removeItem(selectedItem.element);
                                        for (let i = 0; i < allPlayers.length; i++) {
                                            let player = allPlayers[i];
                                            if (player.id === selectedItem.id) {
                                                // delete player
                                                allPlayers.splice(i, 1);
                                                localStorage.setItem('playerDetails', JSON.stringify(allPlayers));
                                                break;
                                            }
                                        }
                                    }
                                });

                                if (this.currentUser.username === 'Admin') {
                                    // open the context menu when the user presses the mouse right button.
                                    myPlayerRoleTree.addEventHandler('contextmenu', function(event) {
                                        event.preventDefault();
                                        if ((event.target).classList.contains('jqx-tree-item')) {
                                            let scrollTop = window.scrollY;
                                            let scrollLeft = window.scrollX;
                                            myPlayerRoleMenu.open(event.clientX + 5 + scrollLeft, event.clientY + 5 + scrollTop);
                                            return false;
                                        } else {
                                            myPlayerRoleMenu.close();
                                        }
                                    });
                                }
                            }
                        }]
                }]
            }];
        return leftLayout;
    }

    generateCenterLayout(): any[] {
        let centerLayout = [
            {
                type: 'layoutGroup',
                orientation: 'horizontal',
                items: [{
                    type: 'tabbedGroup',
                    orientation: 'vertical',
                    width: '100%',
                    allowPin: false,
                    items: [{
                        type: 'layoutPanel',
                        height: 400,
                        minHeight: 200,
                        title: 'Player Image',
                        contentContainer: 'PlayerImagePanel'
                    }]
                }]
            }];
        return centerLayout;
    }

    generateRightLayout(): any[] {
        let rightLayout = [
            {
                type: 'layoutGroup',
                orientation: 'horizontal',
                items: [{
                    type: 'tabbedGroup',
                    orientation: 'vertical',
                    width: '100%',
                    allowPin: false,
                    items: [{
                        type: 'layoutPanel',
                        height: 400,
                        minHeight: 200,
                        title: 'Player Details',
                        contentContainer: 'PlayerDetailsPanel'
                    }]
                }]
            }];
        return rightLayout;
    }

}
