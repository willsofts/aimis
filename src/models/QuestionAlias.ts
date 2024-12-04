import { KnDBConfig, KnRecordSet } from "@willsofts/will-sql";

export interface QuestInfo {
    correlation: string;
    question: string;
    mime: string;
    image: string;
    category?: string;
    agent?: string;
    model?: string;
    imageocr?: string;
    imagetmp?: string;
}

export interface InquiryInfo {
    correlation: string;
    error: boolean;
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
