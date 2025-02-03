import { KnDBConfig, KnRecordSet } from "@willsofts/will-sql";

export interface QuestInfo {
    questionid: string;
    correlation: string;
    question: string;
    mime: string;
    image: string;
    category: string;
    classify?: string;
    agent?: string;
    model?: string;
    imageocr?: string;
    imagetmp?: string;
    property?: any;
    async?: string;
}

export interface InquiryInfo {
    questionid: string;
    correlation: string;
    category: string;
    classify?: string;
    error: boolean;
    statuscode: string;
    question: string;
    query: string;
    answer: string;
    dataset: any;
}

export interface ForumConfig extends KnDBConfig {
    caption: string; //forumtitle
    title: string; //dialecttitle
    type: string; //forumtype
    tableinfo: string; //forumtable
    api?: string; //forumapi
    setting?: string; //forumsetting
    prompt?: string; //forumprompt
    version?: string; //forumdbversion
    webhook?: string; 
    hookflag?: string; 
}

export interface ImageInfo {
    image: string;
    mime: string;
}

export interface InlineData {
    mimeType: string;
    data: string;
}

export interface InlineImage {
    inlineData: InlineData;
}

export interface FileImageInfo extends ImageInfo {
    file: string;
    source: string;
    stream?: string;
}

export interface KnInquirySet extends KnRecordSet {
    correlation: string;
}
