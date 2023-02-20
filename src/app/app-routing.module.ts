import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { BlankComponent } from "./layouts/blank/blank.component";
import { AuthenticationGuard } from "./authentication.guard";


export const Approutes: Routes = [

  {
    path: "",
    component: FullComponent,
    
    children: [
      { path: "", redirectTo: "/projectmanagement/login", pathMatch: "full"},
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboards/dashboard.module").then(
            (m) => m.DashboardModule
          ), canActivate: [AuthenticationGuard]
      },
      {
        path: "projectdashboard",
        loadChildren: () =>
          import("./project-dashboard/project-dashboard.module").then(
            (m) => m.ProjectDashboardModule
          ), canActivate: [AuthenticationGuard]
      },
      {
        path: "formbuilder",
        loadChildren: () =>
          import("./formbuilder/formbuilder.module").then((m) => m.FormbuilderModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "document",
        loadChildren: () =>
          import("./document/document.module").then((m) => m.DocumentModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "toolbar",
        loadChildren: () =>
          import("./toolbar/toolbar.module").then((m) => m.ToolbarModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "projectsection",
        loadChildren: () =>
          import("./projects/projects.module").then((m) => m.ProjectsModule), canActivate: [AuthenticationGuard]
      },
      

      {
        path: "settings",
        loadChildren: () =>
          import("./settings/settings.module").then((m) => m.SettingsModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "starter",
        loadChildren: () =>
          import("./starter/starter.module").then((m) => m.StarterModule), canActivate: [AuthenticationGuard]
      },

      {
        path: "cards",
        loadChildren: () =>
          import("./cards/cards.module").then((m) => m.CardsModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "icons",
        loadChildren: () =>
          import("./icons/icons.module").then((m) => m.IconsModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "ecom",
        loadChildren: () =>
          import("./ecommerce/ecom.module").then((m) => m.EcomModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "timeline",
        loadChildren: () =>
          import("./timeline/timeline.module").then((m) => m.TimelineModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "apps",
        loadChildren: () =>
          import("./apps/apps.module").then((m) => m.AppsModule), canActivate: [AuthenticationGuard]
      },
      {
        path: "sample-pages",
        loadChildren: () =>
          import("./sample-pages/sample-pages.module").then(
            (m) => m.SamplePagesModule
          ), canActivate: [AuthenticationGuard]
      },
    ],
  },

  {
    path: "",
    component: BlankComponent,

    children: [
      {
        path: "authentication",
        loadChildren: () =>
          import("./authentication/authentication.module").then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },

  {
    path: "",
    component: BlankComponent,
    children: [
      {
        path: "projectmanagement",
        loadChildren: () =>
          import("./projectmanagement/projectmanagement.module").then(
            (m) => m.ProjectmanagementModule
          ),
      },
      {
        path: "p3",
        loadChildren: () => import("./p3-documentation/p3-documentation.module").then((mod) => mod.P3DocumentationModule),
      },
      {
        path: "devadmin",
        loadChildren: () =>
          import("./dev-admin/dev-admin.module").then((m) => m.DevAdminModule)
      },
    ],
  },

  {
    path: "**",
    redirectTo: "/authentication/404",
  },
];

