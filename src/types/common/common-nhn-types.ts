
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

// String literal union for NHN NetBox environment choices
export type NHN_CommonNetboxExtraChoicesEnvironments = "na" | "dev" | "qa" | "test" | "prod" | "mgmt" | "lab";
// String literal union for NHN NetBox infrastructure choices
export type NHN_CommonNetboxExtraChoicesInfrastructures = "na" | "bck" | "cert" | "mgmt" | "prod" | "test";
// String literal union for NHN NetBox purpose choices
export type NHN_CommonNetboxExtraChoicesPurposes = "na" | "archive" | "client" | "client_sec" | "datacenter" | "devops" | "guest" | "iot" | "isp" | "lab" | "mgmt" | "monitor" | "nat" | "ops" | "service" | "printer" | "technical" | "video";

