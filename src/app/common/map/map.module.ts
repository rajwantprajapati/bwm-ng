import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core'

import { MapComponent } from './map.component';

@NgModule({
    declarations: [
        MapComponent
    ],
    imports: [ 
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyAGCWZmqFFMBnBH7Eiitm4HEfajpQNFMAM"
        })
    ],
    exports: [
        MapComponent
    ],
    providers: [],
})
export class MapModule {}