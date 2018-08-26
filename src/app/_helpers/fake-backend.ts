import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_models/user';
import { Player } from '../_models/player';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    users: Array<User>;
    players: Array<Player>;

    constructor() {
       this.users = [
           {
               id: 1,
               username: 'Admin',
               password: 'Admin'
           },
           {
               id: 2,
               username: 'User',
               password: 'User'
           },
       ];

       this.players = [
       {
                'id': 'Ind1',
                'name': 'Virat Kohli',
                'country': 'India',                
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Ind2',
                'name': 'MS Dhoni',
                'country': 'India',
                'playerRole': 'Wicket Keeper',
                'image': ''
            },
            {
                'id': 'Ind3',
                'name': 'Yuvraj Singh',
                'country': 'India',
                'playerRole': 'All Rounder',
                'image': ''
            },
            {
                'id': 'Ind4',
                'name': 'Ajinkya Rahane',
                'country': 'India',
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Ind5',
                'name': 'Hardik Pandya',
                'country': 'India',
                'playerRole': 'All Rounder',
                'image': ''
            },
            {
                'id': 'Ind6',
                'name': 'Ashish Nehra',
                'country': 'India',
                'playerRole': 'Bowler',
                'image': ''
            },
            {
                'id': 'Ind7',
                'name': 'Jasprit Bumrah',
                'country': 'India',
                'playerRole': 'Bowler',
                'image': ''
            },
            {
                'id': 'Ind8',
                'name': 'Umesh Yadav',
                'country': 'India',
                'playerRole': 'Bowler',
                'image': ''
            },
            {
                'id': 'Ind9',
                'name': 'Shikhar Dhawan',
                'country': 'India',
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Ind10',
                'name': 'Rohit Sharma',
                'country': 'India',
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Ind11',
                'name': 'Ravichandran Ashwin',
                'country': 'India',
                'playerRole': 'Bowler',
                'image': ''
            },
            {
                'id': 'Aus1',
                'name': 'Aaron Finch',
                'country': 'Australia',
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Aus2',
                'name': 'Tim Paine',
                'country': 'Australia',
                'playerRole': 'Wicket Keeper',
                'image': ''
            },
            {
                'id': 'Aus3',
                'name': 'Travis Head',
                'country': 'Australia',
                'playerRole': 'All Rounder',
                'image': ''
            },
            {
                'id': 'Aus4',
                'name': 'Chris Lynn',
                'country': 'Australia',
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Aus5',
                'name': 'Ashton Agar',
                'country': 'Australia',
                'playerRole': 'All Rounder',
                'image': ''
            },
            {
                'id': 'Aus6',
                'name': 'Jackson Bird',
                'country': 'Australia',
                'playerRole': 'Bowler',
                'image': ''
            },
            {
                'id': 'Aus7',
                'name': 'Chadd Sayers',
                'country': 'Australia',
                'playerRole': 'Bowler',
                'image': ''
            },
            {
                'id': 'Aus8',
                'name': 'Mitchell Starc',
                'country': 'Australia',
                'playerRole': 'Bowler',
                'image': ''
            },
            {
                'id': 'Aus9',
                'name': 'Matt Renshaw',
                'country': 'Australia',
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Aus10',
                'name': "Joe Burns",
                'country': "Australia",
                'playerRole': 'Batsman',
                'image': ''
            },
            {
                'id': 'Aus11',
                'name': 'Kane Richardson',
                'country': 'Australia',
                'playerRole': 'Bowler',
                'image': ''
            }
    ];
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = this.users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        token: 'fake-jwt-token'
                    };
                    localStorage.setItem('playerDetails', JSON.stringify(this.players));

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};