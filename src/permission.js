import router from "./router";
// import store from "./store";
// import { Message } from "element-ui";
// import NProgress from "nprogress"; // progress bar
// import "nprogress/nprogress.css"; // progress bar style
import { getRole, getToken } from "@/utils/auth"; // get token from cookie

// NProgress.configure({ showSpinner: false }); // NProgress Configuration

import { GetUserPermisstionByID } from "@/api/user";

export const fetchUserPermissions = async () => {
  if (!getToken()) return [];

  const resPerm = await GetUserPermisstionByID({});
  if (resPerm.RespCode === 0) {
    const role = getRole();
    if (role == 1000) {
      resPerm.Data = resPerm.Data.map((p) => {
        return {
          ...p,
          CanAccess: 1,
        };
      });
    }
    localStorage.setItem("PermissionsKSVR", JSON.stringify(resPerm.Data));
    return resPerm.Data;
  }

  return [];
};

const whiteList = [
  "/dang-nhap",
  "/khieu-nai",
  "/thong-tin/",
  "/thong-tin-cong-viec/",
]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken();
  console.log("to", to.path);

  if (hasToken) {
    if (to.path === "/dang-nhap") {
      return next({ path: "/" });
    }

    try {
      const permissions = await fetchUserPermissions();
      var permissionActive = [];

      permissionActive = permissions.filter(
        (p) => p.TableName === "Menu" && p.CanAccess == 1
      );

      const routeKey = to.path.replace("/", "");
      const matchedFeature = permissionActive.find(
        (p) => p.FeatureKey === routeKey
      );

      if (to.path === "/") {
        if (permissionActive.length > 0) {
          return next(`/${permissionActive[0].FeatureKey}`);
        } else {
          return next("/404");
        }
      }
      if (
        routeKey === "404" ||
        whiteList.some((path) => to.path.includes(path))
      ) {
        return next();
      }
      if (!matchedFeature) {
        return next("/404"); // hoặc đổi sang / không có quyền
      }
      if (matchedFeature.CanAccess !== 1) {
        return next("/404"); // hoặc đổi sang / không có quyền
      }

      return next();
    } catch (err) {
      return next("/");
    }
  } else {
    if (whiteList.some((path) => to.path.includes(path))) {
      return next();
    }

    return next(`/dang-nhap?redirect=${to.path}`);
  }
});

router.afterEach(() => {
  // NProgress.done();
});
