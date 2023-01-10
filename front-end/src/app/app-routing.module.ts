import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListContainerComponent } from './home/pages/list-container/list-container.component';
import { MainContainerComponent } from './home/pages/main-container/main-container.component';

const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: '',
        component: ListContainerComponent,
        // children: [
        //   {
        //     path: 'list',
        //     component: MainListContainerComponent,
        //     // data: { data: {} },
        //   },
        // ],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
