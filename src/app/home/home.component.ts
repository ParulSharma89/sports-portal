import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../_models/user';
import { Player } from '../_models/player';
import { first } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { jqxMenuComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxmenu';
import { jqxButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';
import { jqxLayoutComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlayout';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent implements AfterViewInit {
    currentUser: User;
    playerData: Array<Player>;
    source: any;
    dataAdapter: any;
    countryTreeSource: any;
    playerRoleTreeSource: any;
    selectedPlayer: any;
    isAdminUser: boolean;
    isAddUserClicked: boolean = false;
    myJqxRightLayout: jqwidgets.jqxLayout;
    @ViewChild('jqxRightLayout') jqxRightLayout: jqxLayoutComponent;
    @ViewChild('inputImage') input;
    url = '';
    playerNameValue: any;
    playerCountryValue: any;
    playerRoleValue: any;
    
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.currentUser.username === 'Admin') {
           this.isAdminUser = true;
        } else {
            this.isAdminUser = false;
        }

        this.isAddUserClicked = JSON.parse(localStorage.getItem('isAddUserClicked'));
        this.playerData = JSON.parse(localStorage.getItem('playerDetails'));
        this.selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer'));
        if (!!this.selectedPlayer) {
          this.playerNameValue = this.selectedPlayer.name;
          this.playerCountryValue = this.selectedPlayer.country;
          this.playerRoleValue = this.selectedPlayer.playerRole;
        }
        
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

   ngAfterViewInit() {
       this.myJqxRightLayout = jqwidgets.createInstance('#jqxRightLayout', 'jqxLayout', { theme: 'material', height: '100%', layout: this.rightLayout });
       
       if (!!this.input) {
           this.input.nativeElement.addEventListener('change', function(event) {
            console.log("test");
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();

                reader.readAsDataURL(event.target.files[0]); // read file as data url

                reader.onload = (event) => { // called once readAsDataURL is completed
                    this.url = event.target.result;
                }
            }
        });
       }
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
                                        var selectedPlayer = matchedPlayers.length ? matchedPlayers[0] : null;
                                        localStorage.setItem('selectedPlayer', JSON.stringify(selectedPlayer));
                                        window.location.reload();
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
                                        var selectedPlayer = matchedPlayers.length ? matchedPlayers[0] : null;
                                        localStorage.setItem('selectedPlayer', JSON.stringify(selectedPlayer));
                                        window.location.reload();
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
                        contentContainer: 'PlayerDetailsPanel',
                        initContent: () => {
                            if (!this.isAddUserClicked) {
                                var myAddButton: jqwidgets.jqxButton = jqwidgets.createInstance('#addNewButton', 'jqxButton', { theme: 'material', width: 100, height: 20 });
                                myAddButton.addEventHandler('click', function() {
                                    this.isAddUserClicked = true;
                                    localStorage.setItem('isAddUserClicked', this.isAddUserClicked);
                                    window.location.reload();
                                });
                            }

                            var mySaveButton: jqwidgets.jqxButton = jqwidgets.createInstance('#saveButton', 'jqxButton', { theme: 'material', width: 100, height: 20 });
                            mySaveButton.addEventHandler('click', function() {
                                this.isAddUserClicked = false;
                                localStorage.setItem('isAddUserClicked', this.isAddUserClicked);
                                window.location.reload();
                            });
                        }
                    }]
                }]
            }];
        return rightLayout;
    }
    
}
