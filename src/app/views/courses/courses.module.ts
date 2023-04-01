import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component'
import { RouterModule, Routes } from '@angular/router';
import { DocsComponentsModule } from "../../../components/docs-components.module";

import { ReactiveFormsModule } from '@angular/forms';

// CoreUI Modules
import {
  AccordionModule,
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';

// views
import { AccordionsComponent } from '../base/accordion/accordions.component';
import { BreadcrumbsComponent } from '../base/breadcrumbs/breadcrumbs.component';
import { CardsComponent } from '../base/cards/cards.component';
import { CarouselsComponent } from '../base/carousels/carousels.component';
import { CollapsesComponent } from '../base/collapses/collapses.component';
import { ListGroupsComponent } from '../base/list-groups/list-groups.component';
import { NavsComponent } from '../base/navs/navs.component';
import { PaginationsComponent } from '../base/paginations/paginations.component';
import { PlaceholdersComponent } from '../base/placeholders/placeholders.component';
import { PopoversComponent } from '../base/popovers/popovers.component';
import { ProgressComponent } from '../base/progress/progress.component';
import { SpinnersComponent } from '../base/spinners/spinners.component';
import { TablesComponent } from '../base/tables/tables.component';
import { TooltipsComponent } from '../base/tooltips/tooltips.component';
import { TabsComponent } from '../base/tabs/tabs.component';
import { BaseRoutingModule } from '../base/base-routing.module';
import { CourseDetailComponent } from './course-detail/course-detail.component';


const routes: Routes = [
  {
    path: '',    
    children: [
      {
        path: '',
        redirectTo: 'course-list',
        pathMatch: 'full',
      },
      {
        path: 'course-list',
        component: CourseListComponent,
        data: {
          title: 'Course List',
        },
      },
      {
        path: 'detail/:data',
        component: CourseDetailComponent,
        data: {
          title: 'Course Detail',
        },
      }
    ]
  },
  
];

@NgModule({
    declarations: [
      CourseListComponent,
      CourseDetailComponent
    ],
    imports: [
        CommonModule,
        DocsComponentsModule,
        CommonModule,
        BaseRoutingModule,
        AccordionModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CardModule,
        CollapseModule,
        GridModule,
        UtilitiesModule,
        SharedModule,
        ListGroupModule,
        IconModule,
        ListGroupModule,
        PlaceholderModule,
        ProgressModule,
        SpinnerModule,
        TabsModule,
        NavModule,
        TooltipModule,
        CarouselModule,
        FormModule,
        ReactiveFormsModule,
        DropdownModule,
        PaginationModule,
        PopoverModule,
        TableModule,
        RouterModule.forChild(routes),
    ]
})
export class CoursesModule { }
