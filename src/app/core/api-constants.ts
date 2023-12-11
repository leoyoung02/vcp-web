import { environment } from '@env/environment';

export const API_GELOCATION_URL = 'https://ipgeolocation.abstractapi.com/v1';
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
export const FEATURE_URL = `${API_BASE}/company/feature`;
export const SUBFEATURE_OPTIONS_URL = `${API_BASE}/company/sub-features/all/options`;
export const SUBFEATURE_URL = `${API_BASE}/company/sub-feature`;
export const FEATURES_MAPPING_URL = `${API_BASE}/guest/features-mapping/combined`;
export const FEATURES_LIST_URL = `${API_BASE}/guest/features-list`;
export const SUBFEATURES_LIST_URL = `${API_BASE}/guest/feature/combined/sub-features`;
export const CREATE_PLAN_ROLES_URL = `${API_BASE}/company/other-settings/create-plan-roles`;
export const CITIES_URL = `${API_BASE}/company/cities`;
export const SUBFEATURE_OPTIONS_MAPPING_URL = `/company/sub-feature/options/mapping`;
export const STRIPE_CUSTOMER_PORTAL_URL = `${API_BASE}/company/customer/portal/create`;
export const EDIT_MEMBER_TYPE_SEQUENCE_URL = `${API_BASE}/profile/fields/edit-sequence`;
export const DELETE_MEMBER_TYPE_URL = `${API_BASE}/company/custom/member/type/delete`;
export const GENERATE_MEMBER_TYPE_LINK_URL = `${API_BASE}/cart/link/generate`;
export const ADD_MEMBER_TYPE_URL = `${API_BASE}/company/custom/member/type/add`;
export const EDIT_MEMBER_TYPE_URL = `${API_BASE}/company/custom/member/type/edit`;
export const SAVE_MEMBER_TYPE_PERMISSIONS_URL = `${API_BASE}/company/custom/member/type/permissions/manage`;
export const ADD_MEMBER_TYPE_FIELD_URL = `${API_BASE}/company/member-type/custom/profile-fields/add`;
export const EDIT_MEMBER_TYPE_FIELD_URL = `${API_BASE}/company/member-type/custom/profile-fields/update`;
export const DELETE_MEMBER_TYPE_FIELD_URL = `${API_BASE}/company/member-type/custom/profile-fields/delete`;
export const MEMBER_TYPE_PROFILE_FIELDS_URL = `${API_BASE}/company/custom/profile/fields`;
export const ADD_CITY_URL = `${API_BASE}/company-admin-city-add`;
export const EDIT_CITY_URL = `${API_BASE}/company-admin-city-edit`;
export const DELETE_CITY_URL = `${API_BASE}/company-admin-city-delete`;
export const EDIT_EMAIL_URL = `${API_BASE}/company/email/edit`;
export const EDIT_MEMBER_EMAIL_URL = `${API_BASE}/company/member-email/edit`;
export const UPLOAD_EMAIL_IMAGE_URL = `${API_BASE}/company/upload-notification-image`;
export const ADD_COMPANY_LOGO_URL = `${API_BASE}/company-admin-branding-upload-logo`;
export const ADD_COMPANY_BANNER_URL = `${API_BASE}/company-admin-branding-upload-banner`;
export const EDIT_COMPANY_LOGO_URL = `${API_BASE}/company/entity/logo/edit`;
export const EDIT_COMPANY_HEADER_IMAGE_URL = `${API_BASE}/company/entity/photo/edit`;
export const EDIT_COMPANY_BANNER_IMAGE_URL = `${API_BASE}/company/entity/video/edit`;
export const EDIT_COMPANY_FAVICON_URL = `${API_BASE}/company/entity/favicon/edit`;
export const SECTORS_URL = `${API_BASE}/company/business-categories`;
export const CIVIL_STATUS_URL = `${API_BASE}/company/civil-status`;
export const WELLBEING_ACTIVITIES_URL = `${API_BASE}/company/wellbeing-activities`;
export const AREA_GROUPS_URL = `${API_BASE}/company/profile/area-groups`;
export const AS_SECTORS_URL = `${API_BASE}/guest/as/business-categories`;
export const EDIT_HOME_VIDEO_SETTINGS_URL = `${API_BASE}/company/home/video/update`;
export const EDIT_HOME_MODULE_SETTINGS_URL = `${API_BASE}/company/home/module/update`;
export const CONTRACTS_URL = `${API_BASE}/guest/contracts`;
export const CONTRACT_URL = `${API_BASE}/guest/contract`;
export const ACCEPT_CONDITIONS_URL = `${API_BASE}/guest/accept/conditions`;
export const EDIT_CONDITIONS_URL = `${API_BASE}/guest/conditions/edit`;
export const STRIPE_ACCOUNTS_URL = `${API_BASE}/company/other-settings/stripe/accounts`;
export const UPDATE_STRIPE_ACCOUNT_STATUS_URL = `${API_BASE}/company/other-settings/stripe/account/status`;
export const DELETE_STRIPE_ACCOUNT_URL = `${API_BASE}/company/other-settings/stripe/account/delete`;
export const STRIPE_WEBHOOKS_URL = `${API_BASE}/guest/other-stripe/webhooks/list`;
export const ADD_STRIPE_WEBHOOK_URL = `${API_BASE}/guest/other-stripe/webhook/add`;
export const ADD_STRIPE_ACCOUNT_URL = `${API_BASE}/company/other-settings/stripe/account/add`;
export const EDIT_STRIPE_ACCOUNT_URL = `${API_BASE}/company/other-settings/stripe/account/edit`;

export const LISTS_MANAGEMENT_DATA_URL = `${API_BASE}/v2/lists-management-data`;
export const MANAGE_MEMBER_TYPES_DATA_URL = `${API_BASE}/v2/manage-member-types-data`;
export const MANAGE_SETTINGS_DATA_URL = `${API_BASE}/v2/settings-data`;
export const MANAGE_SETTINGS_EMAIL_DATA_URL = `${API_BASE}/v2/settings-email-data`;

// HOME
export const LANDING_TEMPLATE_URL = `${API_BASE}/guest/landing/template-by-slug`;
export const HOME_TEMPLATE_URL = `${API_BASE}/company/home/template`;
export const MOBILE_LIMIT_SETTINGS_URL = `${API_BASE}/mobile/settings/limit-all`;

export const HOME_DATA_URL = `${API_BASE}/v2/home`;
export const HOME_COURSES_TUTORS_TESTIMONIALS_DATA_URL = `${API_BASE}/v2/home-courses-tutors-testimonials`;
export const HOME_PLANS_COURSES_DATA_URL = `${API_BASE}/v2/home-plans-courses`;

// SETTINGS
export const SETTINGS_CATEGORY_URL = `${API_BASE}/company/settings/category/list/all`;
export const SETTING_CATEGORY_URL = `${API_BASE}/company/settings/category`;
export const OTHER_SETTINGS_CATEGORY_URL = `${API_BASE}/company/settings/categories`;
export const EDIT_EMAIL_SETTINGS_URL = `${API_BASE}/company/email-settings/edit`;
export const MANAGE_COMPANY_FEATURE_URL = `${API_BASE}/company/feature/mapping/edit`;
export const FEATURE_NAME_EDIT_URL = `${API_BASE}/company/feature/edit`;
export const SUBFEATURE_ACTIVATE_URL = `${API_BASE}/company/feature/sub-feature/activate`;
export const SUBFEATURE_DEACTIVATE_URL = `${API_BASE}/company/feature/sub-feature/deactivate`;
export const SETTINGS_OPTIONS_URL = `${API_BASE}/company/other-settings-options-content`;
export const ACTIVATE_OTHER_SETTING_URL = `${API_BASE}/company/other-settings/activate`;
export const DEACTIVATE_OTHER_SETTING_URL = `${API_BASE}/company/other-settings/deactivate`;
export const SAVE_NEW_BUTTON_MENU_URL = `${API_BASE}/company/menu/new/button/edit`;
export const EDIT_MENU_ORDER_URL = `${API_BASE}/company/menu-order/update`;
export const EDIT_PRIVACY_POLICY_URL = `${API_BASE}/company/privacy-policy/edit-url`;
export const EDIT_COOKIE_POLICY_URL = `${API_BASE}/company/cookie-policy/edit-url`;
export const EDIT_TERMS_AND_CONDITIONS_URL = `${API_BASE}/company/terms-conditions/edit-url`;
export const EDIT_TERMS_URL = `${API_BASE}/company/terms-conditions/update`;
export const EDIT_POLICY_URL = `${API_BASE}/company/policy/update`;
export const EDIT_COOKIE_URL = `${API_BASE}/company/cookie-policy/update`;
export const ACTIVATE_POLICY_URL = `${API_BASE}/company/policy/activate`;
export const ACTIVATE_COOKIE_URL = `${API_BASE}/company/cookie-policy/activate`;
export const ACTIVATE_TERMS_URL = `${API_BASE}/company/terms-conditions/activate`;
export const EDIT_OTHER_SETTING_VALUE_URL = `${API_BASE}/company/other-settings/value/update`;

// REPORTS
export const REPORTS_DATA_URL = `${API_BASE}/v2/reports-data`;
export const EDIT_TEAMS_REPORTS_URL = `${API_BASE}/company/reports/teams/graph/settings/edit`;

// AUTH 
export const LOGIN_URL = `${API_BASE}/company/login`;
export const FORGOT_PASSWORD_URL = `${API_BASE}/central/reset-password`;
export const CHANGE_PASSWORD_URL = `${API_BASE}/central/change-password/vistingo`;
export const SIGNUP_FREE_URL = `${API_BASE}/company/user/signup-no-payment/dynamic`;
export const SEND_EMAIL_CONFIRMATION_URL = `${API_BASE}/company/send/confirmation-email`;
export const SELECT_PLAN_EMAIL_URL = `${API_BASE}/company/email/select-plan`;
export const EMAIL_VERIFICATION_URL = `${API_BASE}/email-verification`;

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
export const PROFILE_FIELDS_URL = `${API_BASE}/company/profile-fields`;
export const PROFILE_FIELDS_MAPPING_URL = `${API_BASE}/company/profile-fields-mapping`;
export const USER_GUID_URL = `${API_BASE}/guest/user-guid`;
export const ACTIVE_MEMBERS_URL = `${API_BASE}/company/admin/members`;
export const FOR_CONFIRMATION_MEMBERS_URL = `${API_BASE}/company/members/for-confirm`;
export const DELETED_MEMBERS_URL = `${API_BASE}/company/members/deleted`;
export const NOT_APPROVED_MEMBERS_URL = `${API_BASE}/company/members/not-approved`;
export const INCOMPLETE_MEMBERS_URL = `${API_BASE}/company/members/incomplete`;
export const FOR_APPROVAL_MEMBERS_URL = `${API_BASE}/company/members/for-approval`;
export const SALES_PERSON_LIST_URL = `${API_BASE}/company/guest/sales/person/list`;
export const BULK_DELETE_USERS_URL = `${API_BASE}/company/users/bulk-delete`;
export const BULK_PERMANENT_DELETE_USERS_URL = `${API_BASE}/company/users/bulk-delete-deletedUsers`;
export const BULK_RECOVER_DELETED_USERS_URL = `${API_BASE}/company/users/bulk-recover-deletedUsers`;
export const DELETE_USER_URL = `${API_BASE}/company/vcp-admin/user/delete`;
export const PERMANENT_DELETE_USER_URL = `${API_BASE}/company/vcp-admin/deleted-user/delete`;
export const RECOVER_DELETED_USER_URL = `${API_BASE}/company/vcp-admin/deleted-user/recover`;
export const ADD_USER_URL = `${API_BASE}/company/vcp-admin/user/add`;
export const ADD_DYNAMIC_USER_URL = `${API_BASE}/company/vcp/user/dynamic/custom/add`;
export const EDIT_DYNAMIC_USER_URL = `${API_BASE}/company/user-details/dynamic/custom/update`;
export const UPDATE_USER_STATUS_URL = `${API_BASE}/company/user/status/update`;
export const BULK_UPDATE_USER_STATUS_URL = `${API_BASE}/company/bulk/user/status/update`;
export const UPDATE_CONFIRM_USER_STATUS_URL = `${API_BASE}/company/user/confirm/status/update`;
export const MEMBERS_LIST_URL = `${API_BASE}/company/members/custom-roles/list`;
export const USER_COURSE_CREDITS_URL = `${API_BASE}/company/user-course-credits`;
export const USER_CREDITS_URL = `${API_BASE}/company/user/credits`;
export const USER_BOOKINGS_URL = `${API_BASE}/company/bookings`;
export const USER_MEMBER_TYPE_URL = `${API_BASE}/user/member-type`;
export const USER_TYPE_PROFILE_FIELDS_URL = `${API_BASE}/company/member-type/custom/profile/fields`;
export const PROFILE_FIELD_SETTINGS_URL = `${API_BASE}/company/custom/profile/fields/settings`;
export const AS_USER_DETAILS_URL = `${API_BASE}/company/as/user`;
export const EDIT_USER_PROFILE_URL = `${API_BASE}/company/profile/dynamic/update`;
export const EDIT_USER_PHOTO_URL = `${API_BASE}/company/personal/photo/update`;
export const EDIT_USER_COMPANY_LOGO_URL = `${API_BASE}/company/company/logo/update`;
export const EDIT_USER_AS_LOGO_URL = `${API_BASE}/company/user/signup/as/logo`;
export const EDIT_USER_PROFILE_FIELDS_SETTINGS_URL = `${API_BASE}/company/profile/settings/manage`;
export const GUARDIAN_STUDENTS_URL = `${API_BASE}/company/guardian/students`;
export const DENY_USER_URL = `${API_BASE}/company/member/deny`;


export const MANAGE_USERS_DATA_URL = `${API_BASE}/v2/manage-users-data`;

// NOTIFICATIONS
export const ACCEPT_CLUB_NOTIFICATION_URL = `${API_BASE}/company-approve-join-group`;
export const ACCEPT_PLAN_NOTIFICATION_URL = `${API_BASE}/company-approve-join-plan`;
export const ACCEPT_CLUB_PLAN_NOTIFICATION_URL = `${API_BASE}/company-approve-join-group-plan`;
export const ACCEPT_PLAN_REQUEST_NOTIFICATION_URL = `${API_BASE}/company-approve-join-plan-request`;
export const DELETE_NOTIFICATION_URL = `${API_BASE}/company/notification/delete`;
export const READ_NOTIFICATION_URL = `${API_BASE}/company-read-notification`;
export const DECLINE_NOTIFICATION_URL = `${API_BASE}/company-decline-notification`;
export const APPROVE_WAITING_LIST_URL = `${API_BASE}/company/waiting-list/approve`;
export const REJECT_WAITING_LIST_URL = `${API_BASE}/company/waiting-list/reject`;
export const ACCEPT_CLUB_REQUEST_URL = `${API_BASE}/company-approve-join-group-request`;
export const COMMENT_DETAILS_URL = `${API_BASE}/company/comment/details`;
export const APPROVE_CLUB_ACTIVITY_URL = `${API_BASE}/company/club-activity/approve`;
export const APPROVE_BLOG_URL = `${API_BASE}/company/blog/approve`;
export const REJECT_BLOG_URL = `${API_BASE}/company/reject/blog`;
export const BLOG_REQUEST_DETAILS_URL = `${API_BASE}/company/blog/request`;

// IMAGES
export const COMPANY_IMAGE_URL = `${API_BASE}/get-image-company`;
export const COURSE_UNIT_IMAGE_URL = `${API_BASE}/get-course-unit-file`;
export const COURSE_IMAGE_URL = `${API_BASE}/get-course-image`;

/**
 * FEATURES
 */

// PLANS
export const PLAN_CATEGORIES_URL = `${API_BASE}/company/event/supercategories/list`;
export const PLAN_CATEGORY_ADD_URL = `${API_BASE}/company/plan-event/category/add`;
export const PLAN_CATEGORY_EDIT_URL = `${API_BASE}/company/plan-event/category/edit`;
export const PLAN_CATEGORY_DELETE_URL = `${API_BASE}/company/plan-event/category/delete`;
export const PLAN_SUBCATEGORIES_URL = `${API_BASE}/company/plan/subcategories-list`;
export const PLAN_SUBCATEGORIES_ADD_URL = `${API_BASE}/company/plan/subcategory/add`;
export const PLAN_SUBCATEGORIES_EDIT_URL = `${API_BASE}/company/plan/subcategory/edit`;
export const PLAN_SUBCATEGORY_DELETE_URL = `${API_BASE}/company/plan/subcategory/delete`;
export const EVENT_CATEGORIES_URL = `${API_BASE}/guest/event/categories/list`;
export const EVENT_SUBCATEGORIES_URL = `${API_BASE}/guest/event/subcategories/list`;
export const EVENT_CUSTOM_SUBCATEGORIES_URL = `${API_BASE}/guest/event/custom/subcategories/list`;
export const PLAN_SUPERCATEGORIES_URL = `${API_BASE}/guest/company/plan/super_categories`;
export const PLAN_SUBCATEGORIES_MAPPING_URL = `${API_BASE}/guest/company/plan/subcategories-mapping-all`;
export const EVENT_TYPES_URL = `${API_BASE}/guest/event/types`;
export const PAST_PLANS_URL = `${API_BASE}/company/all-past-plans`;
export const PLANS_LIST_URL = `${API_BASE}/guest/all-plans-list`;
export const EVENT_SETTINGS_URL = `${API_BASE}/company/event/settings`;
export const PLANS_CALENDAR_URL = `${API_BASE}/company/calendar`;
export const PLAN_EMAIL_TO_URL = `${API_BASE}/company/share-email-template`;
export const PLAN_INVITE_LINK_URL = `${API_BASE}/company/event/invite/link`;
export const PLAN_UPDATE_SLUG_URL = `${API_BASE}/company/event/update-slug`;
export const PLAN_UPDATE_ALIAS_URL = `${API_BASE}/company/user/update-alias`;
export const JOIN_REQUEST_URL = `${API_BASE}/company/join_request`;
export const JOIN_PLAN_URL = `${API_BASE}/company/plan/participant/add`;
export const JOIN_GROUP_PLAN_URL = `${API_BASE}/company/group_plan/participant/add`;
export const LEAVE_GROUP_PLAN_URL = `${API_BASE}/company/group_plan/participant/remove`;
export const LEAVE_PLAN_URL = `${API_BASE}/company/plan/participant/remove`;
export const ADD_TO_WAITING_LIST_URL = `${API_BASE}/company/plan/waiting-list/add`;
export const REMOVE_FROM_WAITING_LIST_URL = `${API_BASE}/company/plan/waiting-list/remove`;
export const ADD_PLAN_COMMENT_URL = `${API_BASE}/company/plan/comment/add`;
export const ADD_GROUP_PLAN_COMMENT_URL = `${API_BASE}/company/group_plans/comment/add`;
export const DELETE_GROUP_PLAN_COMMENT_REACTION_URL = `${API_BASE}/company/delete-group-plan-comment-heart-new`;
export const ADD_GROUP_PLAN_COMMENT_REACTION_URL = `${API_BASE}/company/heart-group-plan-comment-new`;
export const ADD_GROUP_PLAN_COMMENT_REPLY_URL = `${API_BASE}/company/add-group-plan-comment-reply-new`;
export const GROUP_PLAN_COMMENTS_URL = `${API_BASE}/company/group-plan/comments`;
export const DELETE_COMMENT_URL = `${API_BASE}/company/activities/comment/delete`;
export const ANSWER_EMAIL_INVITE_QUESTIONS_URL = `${API_BASE}/company/email-invite/question/answer`;
export const CLUB_PLAN_DELETE_URL = `${API_BASE}/company/group_plans/delete`;
export const DELETE_RECURRING_SERIES_URL = `${API_BASE}/company/activities/recurring/series/delete`;
export const CONFIRM_PLAN_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/company-plan/confirm/attendance`;
export const CLEAR_PLAN_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/company-plan/clear/attendance`;
export const CONFIRM_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/plan/confirm/attendance`;
export const CLEAR_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/plan/clear/attendance`;
export const CONFIRM_PARTICIPANT_URL = `${API_BASE}/company/plan/attendance/confirm`;
export const CLEAR_CONFIRMATION_URL = `${API_BASE}/company/plan/clear/confirm`;
export const CONFIRM_PLAN_PARTICIPANT_URL = `${API_BASE}/company/company-plan/attendance/confirm`;
export const CLEAR_PLAN_CONFIRMATION_URL = `${API_BASE}/company/company-plan/clear/confirm`;
export const CREATE_CLUB_PLAN_URL = `${API_BASE}/company/group_plans/create-optimize`
export const CREATE_PLAN_URL = `${API_BASE}/company/plans/create-optimize`;
export const CREATE_PLAN_FOR_APPROVAL_URL = `${API_BASE}/company/club-activities/approval/notification`;
export const ACTIVITY_CITIES_URL = `${API_BASE}/company/activity/cities`;
export const EDIT_CLUB_PLAN_URL = `${API_BASE}/company/group_plans/edit-new`;
export const EDIT_PLAN_URL = `${API_BASE}/company/plans/edit-new`;
export const CHECK_PLAN_REGISTRATION_URL = `${API_BASE}/event/check-registration`;
export const PLAN_REGISTRATION_URL = `${API_BASE}/company/event/register`;
export const PLAN_GUEST_REGISTRATION_URL = `${API_BASE}/company/event/invite/register/guest`;
export const EDIT_FEATURED_TEXT_URL = `${API_BASE}/company/featured/text/edit`;
export const GUEST_REGISTRATION_FIELDS_URL = `${API_BASE}/company/guest-registration/fields`;
export const ALL_GUEST_REGISTRATION_FIELDS_URL = `${API_BASE}/company/guest-registration/all-fields`;
export const ADD_GUEST_REGISTRATION_FIELDS_URL = `${API_BASE}/company/guest-registration/fields/add`;
export const EDIT_GUEST_REGISTRATION_FIELDS_URL = `${API_BASE}/company/guest-registration/fields/edit`;
export const DELETE_GUEST_REGISTRATION_FIELDS_URL = `${API_BASE}/company/guest-registration/fields/delete`;

export const PLANS_URL = `${API_BASE}/v2/plans`;
export const PLANS_OTHER_DATA_URL = `${API_BASE}/v2/plans-other-data`;
export const PLAN_DETAILS_URL = `${API_BASE}/v2/plan-details`;
export const PLANS_MANAGEMENT_DATA_URL = `${API_BASE}/v2/plans-management-data`;
export const PLAN_REGISTRATION_DATA_URL = `${API_BASE}/v2/plan-registration-data`;

// CLUBS
export const SUBGROUP_TITLE_URL = `${API_BASE}/company/subgroup/titles`;
export const GROUP_CATEGORIES_URL = `${API_BASE}/company/group/categories/list`;
export const GROUP_CATEGORY_ADD_URL = `${API_BASE}/company/group/category/add`;
export const GROUP_CATEGORY_EDIT_URL = `${API_BASE}/company/group/category/edit`;
export const GROUP_CATEGORY_DELETE_URL = `${API_BASE}/company/group/category/delete`;
export const GROUP_SUBCATEGORIES_URL = `${API_BASE}/company/group/subcategories/list`;
export const GROUP_SUBCATEGORY_ADD_URL = `${API_BASE}/company/group/subcategory/add`;
export const GROUP_SUBCATEGORY_EDIT_URL = `${API_BASE}/company/group/subcategory/edit`;
export const GROUP_SUBCATEGORY_DELETE_URL = `${API_BASE}/company/group/subcategory/delete`;
export const CONTACT_FIELDS_URL = `${API_BASE}/guest/contact/fields`;
export const CONTACT_FIELDS_ADD_URL = `${API_BASE}/company/contact/field/add`;
export const CONTACT_FIELDS_EDIT_URL = `${API_BASE}/company/contact/field/edit`;
export const LEAVE_CLUB_URL = `${API_BASE}/company/group/member/remove`;
export const DELETE_CLUB_COMMENT_URL = `${API_BASE}/company/group/comment/delete`;
export const CLUB_COMMENTS_URL = `${API_BASE}/company/group/comments`;
export const ADD_COMMENT_REACTION_URL = `${API_BASE}/heart-group-comment-new`;
export const REMOVE_COMMENT_REACTION_URL = `${API_BASE}/delete-group-comment-heart-new`;
export const ADD_CLUB_COMMENT_URL = `${API_BASE}/company/group/comment/add`;
export const ADD_COMMENT_REPLY_URL = `${API_BASE}/add-group-comment-reply-new`;
export const DELETE_CLUB_URL = `${API_BASE}/company/group/delete`;
export const REQUEST_JOIN_URL = `${API_BASE}/company/group/join_request`;
export const JOIN_CLUB_URL = `${API_BASE}/company/group/member/add`;
export const CLUB_PLANS_URL = `${API_BASE}/company/groups-plans`;
export const ADD_CLUB_URL = `${API_BASE}/company/group-optimize`;
export const EDIT_CLUB_URL = `${API_BASE}/company/groups/edit-admin`;
export const CLUB_MEMBERS_URL = `${API_BASE}/company/club/all-members`;
export const ALL_CLUBS_URL = `${API_BASE}/company/groups`;
export const CLUB_PRESIDENTS_URL = `${API_BASE}/company/club/presidents/mapping`;
export const EDIT_APPROVE_CLUB_ACTIVITIES_URL = `${API_BASE}/company/club-activities-approve/update`;
export const CLUB_ACTIVITY_APPROVE_ROLES_URL = `${API_BASE}/company/club-activity-approve-roles`;

export const CLUBS_URL = `${API_BASE}/v2/clubs`;
export const CLUBS_DATA_URL = `${API_BASE}/v2/clubs-other-data`;
export const CLUB_URL = `${API_BASE}/v2/club-details`;

// JOB OFFERS
export const JOB_OFFERS_URL = `${API_BASE}/v2/job-offers`;
export const JOB_OFFERS_DATA_URL = `${API_BASE}/v2/job-offers-other-data`;
export const JOB_OFFER_URL = `${API_BASE}/v2/job-offer-details`;
export const JOB_OFFER_MIN_URL = `${API_BASE}/v2/job-offer-details-min`;
export const DELETE_JOB_OFFER_URL = `${API_BASE}/company/job/offer/delete`;
export const REGISTER_JOB_OFFER_URL = `${API_BASE}/company/job/register/create`;
export const CREATE_JOB_OFFER_URL = `${API_BASE}/company/job/offer/create-new`;
export const EDIT_JOB_OFFER_URL = `${API_BASE}/company/job/offer/edit-new`;

// CITY GUIDES
export const CITY_GUIDES_URL = `${API_BASE}/v2/city-guides`;
export const CITY_GUIDE_URL = `${API_BASE}/v2/city-guide`;
export const ADD_CITY_GUIDE_URL = `${API_BASE}/v2/city-guide/add`;
export const EDIT_CITY_GUIDE_GENERAL_URL = `${API_BASE}/v2/city-guide/edit`;
export const EDIT_CITY_GUIDE_LIKE_URL = `${API_BASE}/v2/city-guide/like/edit`;
export const EDIT_CITY_GUIDE_URL = `${API_BASE}/company-admin-news-delete`;
export const ADD_CITY_GUIDE_ITEM_URL = `${API_BASE}/v2/city-guide-item/add`;
export const EDIT_CITY_GUIDE_ITEM_URL = `${API_BASE}/v2/city-guide-item/edit`;
export const DELETE_CITY_GUIDE_ITEM_URL = `${API_BASE}/v2/city-guide-item/delete`;

// COURSES
export const COURSE_SUBSCRIPTIONS_URL = `${API_BASE}/course-subscriptions`;
export const COURSE_TUTORS_URL = `${API_BASE}/course-tutors`;
export const COURSE_EXCEPION_USERS_URL = `${API_BASE}/course/exception/users`;
export const COURSES_URL = `${API_BASE}/company/courses`;
export const COURSE_CATEGORY_ADD_URL = `${API_BASE}/company/course/category/add`;
export const COURSE_CATEGORY_EDIT_URL = `${API_BASE}/company/course/category/edit`;
export const COURSE_CATEGORY_DELETE_URL = `${API_BASE}/company/course/category/delete`;
export const COURSE_CATEGORY_ACCESS_ROLES_URL = `${API_BASE}/company/course/category/access/roles`;
export const COURSE_CATEGORY_ACCESS_EDIT_URL = `${API_BASE}/company/course/category/access/edit`;
export const COURSE_CATEGORY_MAPPING_URL = `${API_BASE}/guest/course/category-mapping`;
export const COURSE_CATEGORIES_URL = `${API_BASE}/guest/course/categories`;
export const COURSE_CATEGORY_ACCESS_URL = `${API_BASE}/company/course/category/access/all`;
export const USER_COURSES_URL = `${API_BASE}/guest/courses`;
export const VIMEO_EMBED_URL = `${API_BASE}/course/vimeo/video`;
export const MARK_COMPLETE_URL = `${API_BASE}/course/unit/complete`;
export const RESET_STATUS_URL = `${API_BASE}/course/unit/reset`;
export const COURSE_SECTIONS_URL = `${API_BASE}/course-sections`;
export const COURSE_CTA_URL = `${API_BASE}/course-cta`;
export const COURSE_DOWNLOADS_URL = `${API_BASE}/company/course/downloads`;
export const VISIT_COURSE_UNIT_URL = `${API_BASE}/company/course/unit-visited`;
export const SAVE_COURSE_SESSION_URL = `${API_BASE}/company/course/session`;
export const COURSE_STUDENTS_URL = `${API_BASE}/course/students/report`;
export const NO_COURSE_STUDENTS_URL = `${API_BASE}/course/students/not-assigned`;
export const ASSIGN_USER_COURSES_URL = `${API_BASE}/course/students/assigned`;
export const UNASSIGN_USER_COURSE_URL = `${API_BASE}/course/students/unassigned`;
export const RESEND_ACCESS_URL = `${API_BASE}/course/student/resend-access`;
export const COURSE_UNITS_URL = `${API_BASE}/course/units`;
export const EDIT_STUDENT_CREDIT_URL = `${API_BASE}/company/student/credits/edit`;
export const EDIT_COURSE_STATUS_URL = `${API_BASE}/courses/edit-status`;
export const EDIT_COURSE_LOCK_URL = `${API_BASE}/courses/edit-locked`;
export const DELETE_COURSE_URL = `${API_BASE}/company-admin-course/delete`;
export const DUPLICATE_COURSE_URL = `${API_BASE}/courses/copy`;
export const ADD_COURSE_URL = `${API_BASE}/company-admin-course/add`;
export const EDIT_VIDEO_PHOTO_URL = `${API_BASE}/course-video-photo/edit`;
export const ADD_COURSE_MODULE__URL = `${API_BASE}/company/course/module/add`;
export const EDIT_COURSE_MODULE_URL = `${API_BASE}/company/course/module/edit`;
export const DELETE_COURSE_MODULE_URL = `${API_BASE}/company/course/module/delete`;
export const EDIT_SEQUENCE_URL = `${API_BASE}/course/number/edit-list`;
export const EDIT_COURSE_URL = `${API_BASE}/company-admin-course/edit/image`;
export const ADD_COURSE_DOWNLOAD_URL = `${API_BASE}/company/course/download/add`;
export const EDIT_COURSE_DOWNLOAD_URL = `${API_BASE}/company/course/download/edit`;
export const DELETE_COURSE_DOWNLOAD_URL = `${API_BASE}/company/course/download/delete`;
export const ADD_COURSE_UNIT_URL = `${API_BASE}/company/course/lesson/add`;
export const EDIT_COURSE_UNIT_PHOTO_URL = `${API_BASE}/course-unit-video-photo/edit`;
export const ADMIN_COURSE_UNITS_URL = `${API_BASE}/company-admin-course-lessons`;
export const EDIT_COURSE_UNIT_URL = `${API_BASE}/company/course/lesson/edit`;
export const DELETE_COURSE_UNIT_URL = `${API_BASE}/company-admin-course/lesson/delete`;
export const UNIT_TYPES_URL = `${API_BASE}/company-admin-course-lesson-types`;
export const ADD_CTA_URL = `${API_BASE}/course-cta/add`;
export const EDIT_CTA_URL = `${API_BASE}/course-cta/edit`;
export const DELETE_CTA_URL = `${API_BASE}/course-cta/delete`;
export const COURSE_WALL_URL = `${API_BASE}/company/course/walls`;

export const COURSES_COMBINED_URL = `${API_BASE}/v2/courses`;
export const COURSE_DETAILS_URL = `${API_BASE}/v2/course-details`;
export const COURSE_DETAILS_ADMIN_URL = `${API_BASE}/v2/course-details-admin`;
export const COURSE_UNIT_DETAILS_URL = `${API_BASE}/v2/course-unit-details`;
export const COURSES_ADMIN_LIST_URL = `${API_BASE}/v2/courses-list`;

// TUTORS
export const TUTORS_URL = `${API_BASE}/company/tutors`;
export const CREDIT_PACKAGES_URL = `${API_BASE}/company/credit/packages`;
export const CREDIT_PACKAGE_URL = `${API_BASE}/company/credit/package`;
export const UPDATE_CALENDLY_URL = `${API_BASE}/company/member/calendly/set`;
export const ASK_TUTOR_QUESTION_URL = `${API_BASE}/company/tutor/question/new`;
export const CALENDLY_EVENT_URL = `${API_BASE}/guest/calendly/event`;
export const ADD_TUTOR_BOOKING_URL = `${API_BASE}/company/tutor/booking/add`;
export const COURSE_TUTOR_TYPES_URL = `${API_BASE}/company/tutor/type/courses`;
export const BOOKING_CONFIRMATION_EMAIL_URL = `${API_BASE}/tutor/booking-confirmation/send-email`;
export const PAY_CREDIT_PACKAGE_URL = `${API_BASE}/company/credit-package/pay`;
export const TUTOR_TYPES_URL = `${API_BASE}/company/tutor/types`;
export const TUTOR_PACKAGES_URL = `${API_BASE}/company/tutor/packages`;
export const TUTOR_URL = `${API_BASE}/company/tutor`;
export const TUTOR_ACCOUNT_IDS_URL = `${API_BASE}/company/tutor/account-ids`;
export const STRIPE_ACCOUNT_IDS_URL = `${API_BASE}/company/other-settings/stripe/accounts-id`;
export const ADD_STRIPE_CONNECT_URL = `${API_BASE}/company/tutor/stripe-connect/add`;
export const STRIPE_LOGIN_URL = `${API_BASE}/company/stripe-connect/login`;
export const TUTOR_USER_PACKAGES_URL = `${API_BASE}/company/tutor/user-packages`;
export const CANCEL_BOOKING_URL = `${API_BASE}/tutor/booking/cancel`;
export const ADD_TUTOR_RATING_URL = `${API_BASE}/company/tutor/rating`;
export const EDIT_BOOKING_STATUS_URL = `${API_BASE}/company/booking/edit-status`;
export const TRANSFER_COMMISSION_URL = `${API_BASE}/guest/tutor/booking/transfer/commision`;
export const ADD_FEEDBACK_URL = `${API_BASE}/tutor/booking/feedback/add`;
export const ADD_NOTES_URL = `${API_BASE}/tutor/booking/notes/add`;
export const BOOKING_NOTES_URL = `${API_BASE}/company/tutor/booking/notes`;
export const BOOKING_HISTORY_URL = `${API_BASE}/company/student/booking/history`;
export const TUTOR_COMMISSIONS_URL = `${API_BASE}/tutor/commissions`;
export const BULK_TRANSFER_COMMISSION_URL = `${API_BASE}/tutor/commissions/bulk-transfer`;
export const BOOKINGS_HISTORY_URL = `${API_BASE}/company/bookings-history`;
export const TUTOR_SETTINGS_URL = `${API_BASE}/company/tutor/settings`;
export const ASSIGNED_TUTORS_URL = `${API_BASE}/tutors/assigned`;
export const ASSIGN_TUTOR_COURSES_URL = `${API_BASE}/company/tutor-courses/assign`;
export const TUTOR_COURSES_URL = `${API_BASE}/company/tutor-courses`;
export const TUTOR_COURSES_ACCESS_URL = `${API_BASE}/company/tutor/course-access`;
export const ASSIGN_TUTOR_COURSE_URL = `${API_BASE}/company/tutor/course-assign`;
export const EDIT_TUTOR_URL = `${API_BASE}/company/tutor/edit`;
export const DELETE_COMMISSION_URL = `${API_BASE}/v2/commission/delete`;
export const ADD_TUTOR_TYPE_URL = `${API_BASE}/company/tutor/type/add`;
export const EDIT_TUTOR_TYPE_URL = `${API_BASE}/company/tutor/type/edit`;
export const DELETE_TUTOR_TYPE_URL = `${API_BASE}/company/tutor/type/delete`;
export const COMMISSION_PER_HOUR_URL = `${API_BASE}/company/get/tutor/booking-commission-per-hour`;
export const COMMISSION_PERCENTAGE_URL = `${API_BASE}/company/get/tutor/booking-commission-percentage`;
export const SAVE_COMMISSION_PER_HOUR_URL = `${API_BASE}/company/tutor/booking-commission-per-hour/add`;
export const SAVE_COMMISSION_PERCENTAGE_URL = `${API_BASE}/company/tutor/booking-commission-percentage/add`;
export const ADD_TUTOR_PACKAGE_URL = `${API_BASE}/company/tutor/package/add`;
export const EDIT_TUTOR_PACKAGE_URL = `${API_BASE}/company/tutor/package/edit`;
export const DELETE_TUTOR_PACKAGE_URL = `${API_BASE}/company/tutor/package/delete`;
export const DURATION_UNITS_URL = `${API_BASE}/company/course/duration/units`;
export const EDIT_TUTOR_PACKAGE_STATUS_URL = `${API_BASE}/company/tutor/package/edit-status`;
export const ADD_CREDIT_PACKAGE_URL = `${API_BASE}/company/credit/package/add`;
export const EDIT_CREDIT_PACKAGE_URL = `${API_BASE}/company/credit/package/edit`;
export const EDIT_CREDIT_PACKAGE_STATUS_URL = `${API_BASE}/company/credit/package/edit-status`;
export const DELETE_CREDIT_PACKAGE_URL = `${API_BASE}/company/credit/package/delete`;

export const TUTORS_COMBINED_URL = `${API_BASE}/v2/tutors`;
export const TUTOR_DETAILS_URL = `${API_BASE}/v2/tutor-details`;
export const STRIPE_CONNECT_ACCOUNT_STATUS_URL = `${API_BASE}/v2/stripe-connect-account-status`;

// TESTIMONIALS
export const TESTIMONIALS_DATA_URL = `${API_BASE}/guest/testimonials-data`;
export const ADD_TESTIMONIAL_URL = `${API_BASE}/company/testimonial/add`;
export const EDIT_TESTIMONIAL_URL = `${API_BASE}/company/testimonial/edit`;
export const DELETE_TESTIMONIAL_URL = `${API_BASE}/company/testimonial/delete`;
export const TESTIMONIAL_TAGS_URL = `${API_BASE}/company/testimonial/tags`;
export const ADD_TESTIMONIAL_TAG_URL = `${API_BASE}/company/testimonial/tag/add`;
export const EDIT_TESTIMONIAL_TAG_URL = `${API_BASE}/company/testimonial/tag/edit`;
export const DELETE_TESTIMONIAL_TAG_URL = `${API_BASE}/company/testimonial/tag/delete`;

export const TESTIMONIALS_URL = `${API_BASE}/v2/testimonials`;
export const TESTIMONIAL_DETAILS_URL = `${API_BASE}/v2/testimonial-details`;

// MEMBERS
export const MEMBERS_COMBINED_URL = `${API_BASE}/v2/members`;
export const MEMBER_COMBINED_URL = `${API_BASE}/v2/member-details`;
export const ASK_QUESTION_URL = `${API_BASE}/company/member/question/ask`;
export const SEND_REFERENCE_URL = `${API_BASE}/company/member/reference/send-test1`;

// OFFERS
export const OFFERS_COMBINED_URL = `${API_BASE}/v2/offers`;
export const OFFERS_DATA_URL = `${API_BASE}/v2/offers-data`;
export const OFFER_COMBINED_URL = `${API_BASE}/v2/offer-details`;
export const SHARE_DISCOUNT_URL = `${API_BASE}/company/discount/share/link`;
export const ADD_DISCOUNT_URL = `${API_BASE}/company/discount/create-optimize`;
export const EDIT_DISCOUNT_URL = `${API_BASE}/company/discount/edit`;
export const DELETE_DISCOUNT_URL = `${API_BASE}/company/discount/delete`;

// SERVICIOS
export const SERVICES_COMBINED_URL = `${API_BASE}/v2/services`;
export const SERVICE_COMBINED_URL = `${API_BASE}/v2/service-details`;
export const ADD_SERVICE_URL = `${API_BASE}/company/as-service/add`;
export const EDIT_SERVICE_URL = `${API_BASE}/company/service/edit`;
export const DELETE_SERVICE_URL = `${API_BASE}/company/service/delete`;

// BLOGS
export const BLOGS_COMBINED_URL = `${API_BASE}/v2/blogs`;
export const BLOG_COMBINED_URL = `${API_BASE}/v2/blog-details`;
export const ADD_BLOG_URL = `${API_BASE}/company/blog-new/add`;
export const EDIT_BLOG_URL = `${API_BASE}/company/blog-new/edit`;
export const DELETE_BLOG_URL = `${API_BASE}/company/blog-new/delete`;

// WALL
export const WALL_COMBINED_URL = `${API_BASE}/v2/wall`;
export const POSTS_URL = `${API_BASE}/company/posts`;
export const ADD_POST_URL = `${API_BASE}/company/post/create`;
export const UPDATE_POST_URL = `${API_BASE}/company/post/update`;
export const HEART_POST_URL = `${API_BASE}/company/post-reaction/create`;
export const UNHEART_POST_URL = `${API_BASE}/company/post-reaction/remove`;
export const UPDATE_PIN_STATUS_URL = `${API_BASE}/wall/post/pin`;
export const DELETE_POST_URL = `${API_BASE}/company/post-delete`;
export const EDIT_TUTOR_SECTION_VISIBILITY_URL = `${API_BASE}/company/wall/tutor-section/visibility/edit`;
export const EDIT_TUTOR_VISIBILITY_URL = `${API_BASE}/company/wall/tutor/visibility/edit`;
export const SEND_MEMBER_EMAIL_URL = `${API_BASE}/company/wall-member/send-email`;
export const ASK_COURSE_TUTOR_QUESTION_URL = `${API_BASE}/course/tutor/question/ask`;
export const COURSE_QUESTIONS_URL = `${API_BASE}/course-questions`;
export const DELETE_TUTOR_QUESTION_URL = `${API_BASE}/question/delete`;
export const UPDATE_QUESTION_PIN_STATUS_URL = `${API_BASE}/wall/question/pin`;
export const ANSWER_TUTOR_QUESTION_URL = `${API_BASE}/course/tutor/question/answer`;
export const COURSE_RESOURCES_URL = `${API_BASE}/course-resources`;
export const UPLOAD_RESOURCE_AVAILABILITY_URL = `${API_BASE}/guest/admin-course/uploadable`;
export const ADD_COURSE_RESOURCE_URL = `${API_BASE}/course-resource/add`;

// LEADS
export const LEADS_QUESTIONS_URL = `${API_BASE}/v2/questions`;
export const CREATE_LEADS_QUESTION_URL = `${API_BASE}/v2/question/add`;
export const EDIT_LEADS_QUESTION_URL = `${API_BASE}/v2/question/edit`;
export const DELETE_LEADS_QUESTION_URL = `${API_BASE}/v2/question/delete`;
export const CREATE_LEADS_QUESTION_ITEM_URL = `${API_BASE}/v2/question-item/add`;
export const EDIT_LEADS_QUESTION_ITEM_URL = `${API_BASE}/v2/question-item/edit`;
export const DELETE_LEADS_QUESTION_ITEM_URL = `${API_BASE}/v2/question-item/delete`;
export const CREATE_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL = `${API_BASE}/v2/question-multiple-choice-option/add`;
export const EDIT_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL = `${API_BASE}/v2/question-multiple-choice-option/edit`;
export const DELETE_LEADS_QUESTION_MULTIPLE_CHOICE_OPTION_URL = `${API_BASE}/v2/question-multiple-choice-option/delete`;
export const CREATE_LEADS_QUESTION_RULE_URL = `${API_BASE}/v2/question-rule/add`;
export const EDIT_LEADS_QUESTION_RULE_URL = `${API_BASE}/v2/question-rule/edit`;
export const DELETE_LEADS_QUESTION_RULE_URL = `${API_BASE}/v2/question-rule/delete`;
export const LEADS_LANDING_PAGES_URL = `${API_BASE}/v2/landing-pages`;
export const LEADS_LANDING_PAGE_DETAILS_URL = `${API_BASE}/v2/landing-page-details`;
export const CREATE_LEADS_LANDING_PAGE_URL = `${API_BASE}/v2/landing-page/add`;
export const EDIT_LEADS_LANDING_PAGE_URL = `${API_BASE}/v2/landing-page/edit`;
export const EDIT_LEADS_LANDING_PAGE_DETAILS_URL = `${API_BASE}/v2/landing-page-details/edit`;
export const DELETE_LEADS_LANDING_PAGE_URL = `${API_BASE}/v2/landing-page/delete`;
export const LEADS_LOCATIONS_URL = `${API_BASE}/v2/locations`;
export const CREATE_LEADS_LOCATION_URL = `${API_BASE}/v2/location/add`;
export const EDIT_LEADS_LOCATION_URL = `${API_BASE}/v2/location/edit`;
export const DELETE_LEADS_LOCATION_URL = `${API_BASE}/v2/location/delete`;
export const LEADS_LANDING_PAGE_BY_SLUG_URL = `${API_BASE}/v2/landing-page`;
export const QUESTIONS_URL = `${API_BASE}/v2/landing-questions`;
export const SUBMIT_QUESTION_ANSWERS_URL = `${API_BASE}/v2/landing-questions/answers/submit`;
export const SUBMISSIONS_URL = `${API_BASE}/v2/answers`;
export const EDIT_QUESTION_STYLES_URL = `${API_BASE}/v2/question-styles/edit`;
export const QUESTIONS_BY_ID_URL = `${API_BASE}/v2/landing-questions-by-id`;
export const EDIT_QUESTION_OTHER_IMAGES_URL = `${API_BASE}/v2/question-other-images/edit`;

// VIDEOS && CTAs
export const VIDEOS_CTAS_URL = `${API_BASE}/v2/videos-ctas`;
export const VIDEOS_CTAS_DETAILS_URL = `${API_BASE}/v2/videos-ctas-details`;
export const VIDEO_CTA_BY_SLUG_URL = `${API_BASE}/v2/video-cta`;
export const ADD_VIDEOS_CTAS_URL = `${API_BASE}/v2/videos-ctas/add`;
export const EDIT_VIDEOS_CTAS_URL = `${API_BASE}/v2/videos-ctas/edit`;
export const EDIT_VIDEOS_CTAS_DETAILS_URL = `${API_BASE}/v2/videos-ctas-details/edit`;
export const DELETE_VIDEOS_CTAS_URL = `${API_BASE}/v2/videos-ctas/delete`;
export const EDIT_VIDEOS_CTAS_CTA_SETTINGS_URL = `${API_BASE}/v2/videos-ctas/cta-settings/edit`;