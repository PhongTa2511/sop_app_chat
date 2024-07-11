import { createVuetify } from "vuetify";
import { VBtn } from "vuetify/components/VBtn";
// import { VDataTable, VDataTableServer } from "vuetify/labs/VDataTable";
// import { VDatePicker } from "vuetify/labs/VDatePicker";
import { VCalendar } from "vuetify/labs/VCalendar";
import defaults from "./defaults";
import { icons } from "./icons";
import theme from "./theme";
// Styles
import "@core/scss/template/libs/vuetify/index.scss";
import "vuetify/styles";

export default createVuetify({
  aliases: {
    IconBtn: VBtn,
  },
  components: {
    VCalendar,
  },
  defaults,
  icons,
  theme,
});
