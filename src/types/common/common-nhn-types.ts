/**
 * NHN NetBox domain enum for network domain and DNS zone selections in organizational infrastructure.
 * Provides standardized domain choices for NetBox custom field filtering and network configuration.
 * 
 * @enum NHN_CommonNetboxExtraChoicesDomain
 * @since NHN v1.0
 * @context NetBox custom field domain filtering
 * @values 44 predefined NHN organizational domains
 * 
 * @example
 * ```typescript
 * const domain = NHN_CommonNetboxExtraChoicesDomain["nhn.local"];
 * const prodDomain = NHN_CommonNetboxExtraChoicesDomain["prod.drift.nhn.no"];
 * ```
 */
export enum NHN_CommonNetboxExtraChoicesDomain {
    na = "na",
    "365lab.no" = "365lab.no",
    "ld.365lab.no" = "ld.365lab.no",
    "ad.ehelse.no" = "ad.ehelse.no",
    "ad.noma.no" = "ad.noma.no",
    "cloud.ld.nhn.no" = "cloud.ld.nhn.no",
    "cloud.nhn.no" = "cloud.nhn.no",
    "drift.nhn.no" = "drift.nhn.no",
    "fhi.no" = "fhi.no",
    "fihr.no" = "fihr.no",
    "helsedir.local" = "helsedir.local",
    "mgmt.ld.nhn.no" = "mgmt.ld.nhn.no",
    "mgmtlab.nhn.no" = "mgmtlab.nhn.no",
    "nhn.local" = "nhn.local",
    "nhnadsec.nhn.no" = "nhnadsec.nhn.no",
    "npe.no" = "npe.no",
    "nrpa.local" = "nrpa.local",
    "pam.ld.nhn.no" = "pam.ld.nhn.no",
    "pam.nhn.no" = "pam.nhn.no",
    "pegasus.nhn.no" = "pegasus.nhn.no",
    "prod.drift.nhn.no" = "prod.drift.nhn.no",
    "prod.ld.nhn.no" = "prod.ld.nhn.no",
    "prod.tjp.ld.nhn.no" = "prod.tjp.ld.nhn.no",
    "purple.ts" = "purple.ts",
    "qa.drift.nhn.no" = "qa.drift.nhn.no",
    "qa.ld.nhn.no" = "qa.ld.nhn.no",
    "qa.mgmt.ld.nhn.no" = "qa.mgmt.ld.nhn.no",
    "qa.tjp.ld.nhn.no" = "qa.tjp.ld.nhn.no",
    "red.fhi.sec" = "red.fhi.sec",
    "shdir.no" = "shdir.no",
    "test.drift.nhn.no" = "test.drift.nhn.no",
    "test.ld.nhn.no" = "test.ld.nhn.no",
    "test.mgmt.ld.nhn.no" = "test.mgmt.ld.nhn.no",
    "test.pam.nhn.no" = "test.pam.nhn.no",
    "test.tjp.ld.nhn.no" = "test.tjp.ld.nhn.no",
    "utv.ld.nhn.no" = "utv.ld.nhn.no",
    "utv.nhn.no" = "utv.nhn.no",
    "test.video.nhn.no" = "test.video.nhn.no",
    "video.nhn.no" = "video.nhn.no",
    "yellow.ext" = "yellow.ext",
    "qa.tjenesteplattform.nhn.no" = "qa.tjenesteplattform.nhn.no",
    "prod.tjenesteplattform.nhn.no" = "prod.tjenesteplattform.nhn.no",
    "test.tjenesteplattform.nhn.no" = "test.tjenesteplattform.nhn.no",
    "laf.ld.nhn.no" = "laf.ld.nhn.no",
    "prod.kp.ld.nhn.no" = "prod.kp.ld.nhn.no",
    "test.kp.ld.nhn.no" = "test.kp.ld.nhn.no",
    "prod.lrs.ld.nhn.no" = "prod.lrs.ld.nhn.no",
    "test.lrs.ld.nhn.no" = "test.lrs.ld.nhn.no",
    "mgmt.kp.ld.nhn.no" = "mgmt.kp.ld.nhn.no"
};

/**
 * NHN NetBox environment enum for organizational environment classification and lifecycle management.
 * Standardized environment choices for network segmentation and deployment stage identification.
 * 
 * @enum NHN_CommonNetboxExtraChoicesEnvironment
 * @since NHN v1.0
 * @context NetBox custom field environment filtering
 * @values 7 standard NHN deployment environments
 */
export enum NHN_CommonNetboxExtraChoicesEnvironment {
    na = "na", // Not applicable or undefined environment
    dev = "dev", // Development environment for active development
    qa = "qa", // Quality assurance environment for testing
    test = "test", // Testing environment for validation
    prod = "prod", // Production environment for live services
    mgmt = "mgmt", // Management environment for infrastructure
    lab = "lab" // Laboratory environment for experimentation
};

/**
 * NHN NetBox infrastructure enum for service classification and infrastructure type categorization.
 * Defines infrastructure categories for organizational resource management and service delivery.
 * 
 * @enum NHN_CommonNetboxExtraChoicesInfrastructure
 * @since NHN v1.0
 * @context NetBox custom field infrastructure filtering
 * @values 6 standard NHN infrastructure classifications
 */
export enum NHN_CommonNetboxExtraChoicesInfrastructure {
    na = "na", // Not applicable or undefined infrastructure
    bck = "bck", // Backup infrastructure and disaster recovery
    cert = "cert", // Certificate and PKI infrastructure
    mgmt = "mgmt", // Management infrastructure and tooling
    prod = "prod", // Production infrastructure for services
    test = "test" // Testing infrastructure for validation
};

/**
 * NHN NetBox purpose enum for network segment purpose classification and service categorization.
 * Standardized purpose definitions for network planning and security policy implementation.
 * 
 * @enum NHN_CommonNetboxExtraChoicesPurpose
 * @since NHN v1.0
 * @context NetBox custom field purpose filtering
 * @values 18 standard NHN network segment purposes
 */
export enum NHN_CommonNetboxExtraChoicesPurpose {
    na = "na", // Not applicable or undefined purpose
    archive = "archive", // Archive and long-term storage systems
    client = "client", // Client access and user endpoints
    client_sec = "client_sec", // Secure client access and endpoints
    datacenter = "datacenter", // Data center infrastructure services
    devops = "devops", // DevOps and automation infrastructure
    guest = "guest", // Guest access and temporary connectivity
    iot = "iot", // Internet of Things devices and sensors
    isp = "isp", // Internet service provider connectivity
    lab = "lab", // Laboratory and experimental networks
    mgmt = "mgmt", // Management and administrative services
    monitor = "monitor", // Monitoring and observability systems
    nat = "nat", // Network address translation services
    ops = "ops", // Operations and support infrastructure
    service = "service", // Application and business services
    printer = "printer", // Printing and document services
    technical = "technical", // Technical and engineering systems
    video = "video" // Video conferencing and media services
};

// NHN NetBox domain choices type for organizational DNS zone filtering
export type NHN_CommonNetboxExtraChoicesDomains = "na" | "365lab.no" | "ld.365lab.no" | "ad.ehelse.no" | "ad.noma.no" | "cloud.ld.nhn.no" | "cloud.nhn.no" | "drift.nhn.no" | "fhi.no" | "fihr.no" | "helsedir.local" | "mgmt.ld.nhn.no" | "mgmtlab.nhn.no" | "nhn.local" | "nhnadsec.nhn.no" | "npe.no" | "nrpa.local" | "pam.ld.nhn.no" | "pam.nhn.no" | "pegasus.nhn.no" | "prod.drift.nhn.no" | "prod.ld.nhn.no" | "prod.tjp.ld.nhn.no" | "purple.ts" | "qa.drift.nhn.no" | "qa.ld.nhn.no" | "qa.mgmt.ld.nhn.no" | "qa.tjp.ld.nhn.no" | "red.fhi.sec" | "shdir.no" | "test.drift.nhn.no" | "test.ld.nhn.no" | "test.mgmt.ld.nhn.no" | "test.pam.nhn.no" | "test.tjp.ld.nhn.no" | "utv.ld.nhn.no" | "utv.nhn.no" | "test.video.nhn.no" | "video.nhn.no" | "yellow.ext" | "qa.tjenesteplattform.nhn.no" | "prod.tjenesteplattform.nhn.no" | "test.tjenesteplattform.nhn.no" | "laf.ld.nhn.no" | "prod.kp.ld.nhn.no" | "test.kp.ld.nhn.no" | "prod.lrs.ld.nhn.no" | "test.lrs.ld.nhn.no" | "mgmt.kp.ld.nhn.no";
// NHN NetBox environment choices type for deployment stage classification
export type NHN_CommonNetboxExtraChoicesEnvironments = "na" | "dev" | "qa" | "test" | "prod" | "mgmt" | "lab";
// NHN NetBox infrastructure choices type for service classification
export type NHN_CommonNetboxExtraChoicesInfrastructures = "na" | "bck" | "cert" | "mgmt" | "prod" | "test";
// NHN NetBox purpose choices type for network segment categorization
export type NHN_CommonNetboxExtraChoicesPurposes = "na" | "archive" | "client" | "client_sec" | "datacenter" | "devops" | "guest" | "iot" | "isp" | "lab" | "mgmt" | "monitor" | "nat" | "ops" | "service" | "printer" | "technical" | "video";

