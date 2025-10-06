/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "apollo-upload-client/UploadHttpLink.mjs" {
  import { ApolloLink, HttpOptions } from "@apollo/client";

  export interface UploadHttpLinkOptions extends Partial<HttpOptions> {
    uri?: string | ((operation: any) => string);
    credentials?: string;
    headers?: Record<string, string>;
    fetch?: typeof fetch;
    fetchOptions?: RequestInit;
    includeExtensions?: boolean;
    useGETForQueries?: boolean;
    isExtractableFile?: (value: any) => boolean;
    formDataAppendFile?: (
      formData: FormData,
      fieldName: string,
      file: any
    ) => void;
  }

  class UploadHttpLink extends ApolloLink {
    constructor(options?: UploadHttpLinkOptions);
  }

  export default UploadHttpLink;
}

// Also support import without .mjs extension
declare module "apollo-upload-client" {
  export { default } from "apollo-upload-client/UploadHttpLink.mjs";
}

declare module "apollo-upload-client/formDataAppendFile.mjs" {
  export default function formDataAppendFile(
    formData: FormData,
    fieldName: string,
    file: any
  ): void;
}

declare module "apollo-upload-client/isExtractableFile.mjs" {
  export default function isExtractableFile(value: any): boolean;
}
