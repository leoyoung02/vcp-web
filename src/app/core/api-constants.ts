import { environment } from '@env/environment';

export const API_BASE = environment.api;

// PLATFORMS
export const COMPANIES_URL = `${API_BASE}/guest/companies-new`;
export const FEATURES_URL = `${API_BASE}/guest/features`;
export const CONFIRM_EMAIL_URL = `${API_BASE}/company/check/confirm-email`;
export const OTHER_SETTINGS_URL = `${API_BASE}/company/other-settings`;
export const DASHBOARD_DETAILS_URL = `${API_BASE}/guest/dashboard/details`;
export const LANGUAGES_URL = `${API_BASE}/languages`;
export const MEMBER_TYPES_URL = `${API_BASE}/guest/custom/member-types`;
export const FEATURE_MAPPING_URL = `${API_BASE}/company/feature/mapping`;
export const FEATURE_SUBFEATURES_URL = `${API_BASE}/guest/feature/all/sub-features`;
export const SUBFEATURES_URL = `${API_BASE}/guest/sub-features`;
export const MEMBERS_ONLY_SETTINGS_URL = `${API_BASE}/guest/subfeature/member-settings`;
export const SUBFEATURES_MAPPING_URL = `${API_BASE}/company/subfeature/mapping`;
export const CONTACT_DETAILS_URL = `${API_BASE}/company/contact-us/details`;
export const MENU_ORDERING_URL = `${API_BASE}/guest/menu-order`;
export const VERSION_URL = `${API_BASE}/company/version`;
export const META_DESCRIPTION_URL = `${API_BASE}/company/meta_description`;
export const COUNTRIES_URL = `${API_BASE}/guest/countries`;
export const MEMBER_PLANS_URL = `${API_BASE}/guest/custom/member/type/pricing-details`;
export const MEMBER_PLANS_LIST_URL = `${API_BASE}/guest/custom/member/type/permissions/list`;
export const STRIPE_PK_URL = `${API_BASE}/guest/stripe/publishable-key`;
export const MEMBER_PLAN_SUBSCRIPTION_URL = `${API_BASE}/company/member-type/subscription`;

export const FEATURES_MAPPING_URL = `${API_BASE}/guest/features-mapping/combined`;
export const FEATURES_LIST_URL = `${API_BASE}/guest/features-list`;

// SETTINGS
export const SETTINGS_CATEGORY_URL = `${API_BASE}/company/settings/category/list/all`;
export const OTHER_SETTINGS_CATEGORY_URL = `${API_BASE}/company/settings/categories`;
export const EDIT_EMAIL_SETTINGS_URL = `${API_BASE}/company/email-settings/edit`;
export const MANAGE_COMPANY_FEATURE_URL = `${API_BASE}/company/feature/mapping/edit`;

// AUTH 
export const LOGIN_URL = `${API_BASE}/company/login`;
export const FORGOT_PASSWORD_URL = `${API_BASE}/central/reset-password`;
export const CHANGE_PASSWORD_URL = `${API_BASE}/central/change-password/vistingo`;
export const SIGNUP_FREE_URL = `${API_BASE}/company/user/signup-no-payment/dynamic`;
export const SEND_EMAIL_CONFIRMATION_URL = `${API_BASE}/company/send/confirmation-email`;
export const SELECT_PLAN_EMAIL_URL = `${API_BASE}/company/email/select-plan`;

// PAYMENT
export const VALIDATE_COUPON_URL = `${API_BASE}/company/member-plan/validate-coupon`;
export const CART_USER_SIGNUP_URL = `${API_BASE}/guest/cart/user/signup`;
export const SUBSCRIBE_TRIAL_URL = `${API_BASE}/guest/stripe/pay`;
export const SUBSCRIBE_MEMBER_URL = `${API_BASE}/company/user/custom-member-type/pay`;
export const GUID_IDEMPOTENCY_URL = `${API_BASE}/stripe/update-guid-idempotency`;
export const UPDATE_SUBSCRIPTION_URL = `${API_BASE}/stripe/update-paid`;
export const CART_ASSIGN_COURSES_URL = `${API_BASE}/cart/courses/assign`;

// USER
export const CHECK_EXPIRED_URL = `${API_BASE}/guest/expired/check`;
export const CHECK_MEMBER_TYPES_URL = `${API_BASE}/user/member-types-by-email`;
export const CHECK_OTHER_MEMBER_TYPES_URL = `${API_BASE}/guest/expired/user-member-type`;
export const USER_URL = `${API_BASE}/company/user`;
export const USER_ROLE_URL = `${API_BASE}/company/user/role`;
export const USER_MEMBER_TYPES_URL = `${API_BASE}/user/member-types`;
export const USER_NOTIFICATIONS_URL = `${API_BASE}/company-user-notifications`;
export const USER_ALL_NOTIFICATIONS_URL = `${API_BASE}/company-user-notifications-all`;
export const USER_CHECK_ADMIN_URL = `${API_BASE}/central/isAdminById`;
export const CUSTOM_MEMBER_TYPE_PERMISSIONS_URL = `${API_BASE}/company/custom/member/type/permissions-new`;
export const REGISTRATION_FIELDS_URL = `${API_BASE}/guest/registration-fields`;
export const REGISTRATION_FIELDS_MAPPING_URL = `${API_BASE}/guest/registration-fields-mapping`;
export const EDIT_CUSTOM_MEMBER_TYPE_URL = `${API_BASE}/company/user/custom-member-type/edit`;

// IMAGES
export const COMPANY_IMAGE_URL = `${API_BASE}/get-image-company`;

// FEATURES

// COURSES
export const COURSE_CATEGORY_MAPPING_URL = `${API_BASE}/guest/course/category-mapping`;

// CLUBS
export const SUBGROUP_TITLE_URL = `${API_BASE}/company/subgroup/titles`;

// TUTORS
export const TUTORS_URL = `${API_BASE}/company/tutors`;

// COURSES
export const COURSE_SUBSCRIPTIONS_URL = `${API_BASE}/course-subscriptions`;
export const COURSE_TUTORS_URL = `${API_BASE}/course-tutors`;
export const COURSE_EXCEPION_USERS_URL = `${API_BASE}/course/exception/users`;
export const COURSES_URL = `${API_BASE}/company/courses`;