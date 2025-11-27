// NHN NetBox domain enumeration for DNS zone selections
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

// NHN NetBox environment enumeration for deployment classification
export enum NHN_CommonNetboxExtraChoicesEnvironment {
    na = "na",
    dev = "dev",
    qa = "qa",
    test = "test",
    prod = "prod",
    mgmt = "mgmt",
    lab = "lab"
};

// NHN NetBox infrastructure enumeration for service classification
export enum NHN_CommonNetboxExtraChoicesInfrastructure {
    na = "na",
    bck = "bck",
    cert = "cert",
    mgmt = "mgmt",
    prod = "prod",
    test = "test"
};

// NHN NetBox purpose enumeration for network segment classification
export enum NHN_CommonNetboxExtraChoicesPurpose {
    na = "na",
    archive = "archive",
    client = "client",
    client_sec = "client_sec",
    datacenter = "datacenter",
    devops = "devops",
    guest = "guest",
    iot = "iot",
    isp = "isp",
    lab = "lab",
    mgmt = "mgmt",
    monitor = "monitor",
    nat = "nat",
    ops = "ops",
    service = "service",
    printer = "printer",
    technical = "technical",
    video = "video"
};

// String literal union for NHN NetBox domain choices
export type NHN_CommonNetboxExtraChoicesDomains = "na" | "365lab.no" | "ld.365lab.no" | "ad.ehelse.no" | "ad.noma.no" | "cloud.ld.nhn.no" | "cloud.nhn.no" | "drift.nhn.no" | "fhi.no" | "fihr.no" | "helsedir.local" | "mgmt.ld.nhn.no" | "mgmtlab.nhn.no" | "nhn.local" | "nhnadsec.nhn.no" | "npe.no" | "nrpa.local" | "pam.ld.nhn.no" | "pam.nhn.no" | "pegasus.nhn.no" | "prod.drift.nhn.no" | "prod.ld.nhn.no" | "prod.tjp.ld.nhn.no" | "purple.ts" | "qa.drift.nhn.no" | "qa.ld.nhn.no" | "qa.mgmt.ld.nhn.no" | "qa.tjp.ld.nhn.no" | "red.fhi.sec" | "shdir.no" | "test.drift.nhn.no" | "test.ld.nhn.no" | "test.mgmt.ld.nhn.no" | "test.pam.nhn.no" | "test.tjp.ld.nhn.no" | "utv.ld.nhn.no" | "utv.nhn.no" | "test.video.nhn.no" | "video.nhn.no" | "yellow.ext" | "qa.tjenesteplattform.nhn.no" | "prod.tjenesteplattform.nhn.no" | "test.tjenesteplattform.nhn.no" | "laf.ld.nhn.no" | "prod.kp.ld.nhn.no" | "test.kp.ld.nhn.no" | "prod.lrs.ld.nhn.no" | "test.lrs.ld.nhn.no" | "mgmt.kp.ld.nhn.no";
// String literal union for NHN NetBox environment choices
export type NHN_CommonNetboxExtraChoicesEnvironments = "na" | "dev" | "qa" | "test" | "prod" | "mgmt" | "lab";
// String literal union for NHN NetBox infrastructure choices
export type NHN_CommonNetboxExtraChoicesInfrastructures = "na" | "bck" | "cert" | "mgmt" | "prod" | "test";
// String literal union for NHN NetBox purpose choices
export type NHN_CommonNetboxExtraChoicesPurposes = "na" | "archive" | "client" | "client_sec" | "datacenter" | "devops" | "guest" | "iot" | "isp" | "lab" | "mgmt" | "monitor" | "nat" | "ops" | "service" | "printer" | "technical" | "video";

