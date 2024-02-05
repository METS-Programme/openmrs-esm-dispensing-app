import { defineConfigSchema, getSyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import dispensingComponent from "./dispensing.component";
import dispensingLinkComponent from "./dispensing-link.component";
import dispensingDashboardComponent from "./dashboard/dispensing-dashboard.component";
import dispensingAppMenu from "./components/dispensing-app-menu-app-item/dispensing-app-menu-app-item.component";

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const moduleName = "@openmrs/esm-dispensing-app";

const options = {
  featureName: "dispensing",
  moduleName,
};

export const dispensing = getSyncLifecycle(dispensingComponent, options);

export const dispensingLink = getSyncLifecycle(
  dispensingLinkComponent,
  options
);

export const dispensingDashboard = getSyncLifecycle(
  dispensingDashboardComponent,
  options
);

export const dispensingAppMenuItem = getSyncLifecycle(
  dispensingAppMenu,
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
