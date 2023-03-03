import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassesComponent } from './classes/classes.component';
import { RouterModule, Routes } from '@angular/router';
import { DocsComponentsModule } from "../../../components/docs-components.module";

import { ReactiveFormsModule } from '@angular/forms';

// CoreUI Modules
import {
  AccordionModule,
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


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base',
    },
    children: [
      {
        path: 'courses',
        component: ClassesComponent,
        data: {
          title: 'Accordion',
        },
      }
    ],
  },
];

@NgModule({
    declarations: [
        ClassesComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        DocsComponentsModule,
        CommonModule,
        BaseRoutingModule,
        AccordionModule,
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
    ]
})
export class ClassesModule { }
