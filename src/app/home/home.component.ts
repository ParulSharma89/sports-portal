import { Component } from '@angular/core';
import { User } from '../_models/user';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})

export class HomeComponent {
    currentUser: User;
    leftLayout: any[] = this.generateLeftLayout();
    centerLayout: any[] = this.generateCenterLayout();
    rightLayout: any[] = this.generateRightLayout();

    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

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
                            contentContainer: 'CountryPanel'
                        },
                        {
                            type: 'layoutPanel',
                            title: 'Player Role',
                            contentContainer: 'PlayerRolePanel'
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
