import axios from 'axios';

// 统一的前置 URI
const BASE_URL = 'https://cardepoch.com/api/dz/sms';

/**
 * 通用响应基础结构
 */
export interface SmsBaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ==========================================
// 1. 获取 Token
// ==========================================
export interface GetTokenData {
  token: string;
}
export type GetTokenResponse = SmsBaseResponse<GetTokenData>;

export const getToken = async (username: string, password: string): Promise<GetTokenResponse> => {
  const response = await axios.get<GetTokenResponse>(`${BASE_URL}/getToken`, {
    params: { username, password },
  });
  return response.data;
};

// ==========================================
// 2. 获取号码列表
// ==========================================
export interface PhoneItem {
  phone: string;
  country: string;
  /** 注：文档描述为String，但示例为时间戳数字，此处修正为number以匹配实际返回 */
  time: number; 
  simStatus: string;
}
export type GetPhoneListResponse = SmsBaseResponse<PhoneItem[]>;

export const getPhoneList = async (token: string, country?: string): Promise<GetPhoneListResponse> => {
  const response = await axios.get<GetPhoneListResponse>(`${BASE_URL}/getPhoneList`, {
    params: { token, country },
  });
  return response.data;
};

// ==========================================
// 3 & 4. 短信发送 (文本 / 图片)
// ==========================================
export interface SendMessageData {
  msg: string;
  msgId: string;
  /** 注：文档描述为String，但示例为数字，此处兼容 string | number */
  traceId: string | number; 
  time: number;
}
export type SendMessageResponse = SmsBaseResponse<SendMessageData>;

/** 发送文本短信 */
export const sendTextMessage = async (
  token: string,
  phone: string,
  targetPhone: string,
  text: string
): Promise<SendMessageResponse> => {
  const response = await axios.get<SendMessageResponse>(`${BASE_URL}/sendMessage`, {
    params: { token, phone, targetPhone, text },
  });
  return response.data;
};

/** 发送图片短信 */
export const sendImageMessage = async (
  token: string,
  phone: string,
  targetPhone: string,
  imageUrl: string
): Promise<SendMessageResponse> => {
  const response = await axios.get<SendMessageResponse>(`${BASE_URL}/sendMessage`, {
    params: { token, phone, targetPhone, imageUrl },
  });
  return response.data;
};

// ==========================================
// 5. 获取短信查询 (接收记录)
// ==========================================
export interface SmsMessageItem {
  msgDirection: string;
  msgType: string;
  isDeleted: boolean;
  contactValue: string;
  isRead: boolean;
  msgId: string;
  /** 注：文档描述为String，但示例为时间戳数字，此处修正为number */
  msgTime: number; 
  msgText: string;
  contactType: string;
}

export interface GetCodeData {
  phone: string;
  country: string;
  codeList: SmsMessageItem[];
}
export type GetCodeResponse = SmsBaseResponse<GetCodeData>;

export const getSmsMessages = async (token: string, phone: string): Promise<GetCodeResponse> => {
  const response = await axios.get<GetCodeResponse>(`${BASE_URL}/getCode`, {
    params: { token, phone },
  });
  return response.data;
};

// ==========================================
// 附加：状态码与 Msg 码值枚举 (方便业务层进行逻辑判断)
// ==========================================
export enum SmsStatusCode {
  SUCCESS = 200,
  TOKEN_ERROR = 3100,
  PHONE_USED = 3101,
  PHONE_NO_STOCK = 3102,
  PHONE_NULL = 3103,
  ONLINE_LIMIT = 3104,
  TARGET_NUMBER_REQUIRED = 3105,
  IMAGE_URL_REQUIRED = 3110,
  CONTENT_EMPTY = 3111,
  NUMBER_INVALID = 3112,
  EXCEPTION_MESSAGE = 3113,
}

export enum SmsMsgCode {
  OK = 'OK',
  BLOCKED = 'blocked',
  VERIFY = 'verify',
  MANY_MESSAGES = 'many messages',
  DATA_NOT_FOUND = 'Data no found',
  CALL_APP_FAIL = 'call app fail',
  SIM_INVALID = 'sim invalid',
  LIMITED = 'limited',
}
