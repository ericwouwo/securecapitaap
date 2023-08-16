import { Component, Input } from '@angular/core';
import { Stats } from 'src/app/interface/stats';
import { User } from 'src/app/interface/user';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent {

  @Input() stats: Stats;

}
