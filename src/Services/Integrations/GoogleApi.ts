import loadScript from 'load-script';
import * as _ from 'lodash';
import Axios from 'axios';
import pathParse from 'path-parse';
import {GOOGLE_SDK_URL, GOOGLE_API_KEY, GOOGLE_DRIVE_API_URL, GOOGLE_MIME_TYPES, MIME_TYPES,} from 'Utils/constants';
import {lessThan40MB} from 'Utils/validation';
// import { FileDownloadCallback, ErrorCallback } from './Interfaces';
type FileDownloadCallback = (values: any) => any;
type ErrorCallback = (values: any) => any;

loadScript(GOOGLE_SDK_URL, () => {
    //@ts-ignore
    const {gapi} = window;
    if (gapi) {
        gapi.load('auth');
        gapi.load('picker');
    }
});

interface AuthParams {
    scope?: string[];
    immediate?: boolean;
}

interface GoogleDrivePickerInitParams {
    accessToken: string;
    acceptableFormats?: string;
    onPick?: FileDownloadCallback;
    onError?: ErrorCallback;
    authParams?: AuthParams;
}

class GoogleApi {
    initGoogleDrivePicker = async (options: GoogleDrivePickerInitParams) => {
        const {acceptableFormats, onPick, onError, accessToken} = options;

        try {
            if (!accessToken) {
                throw new Error('No access token provided');
            }

            //@ts-ignore
            const {DocsView, PickerBuilder, Action} = window.google.picker;
            const docsView = new DocsView().setParent('root').setIncludeFolders(true);

            if (acceptableFormats) {
                docsView.setMimeTypes(acceptableFormats);
            }

            const picker = new PickerBuilder()
                .addView(docsView)
                .setOAuthToken(accessToken)
                .setDeveloperKey(GOOGLE_API_KEY)
                .setCallback(async data => {
                    if (data.action === Action.PICKED) {
                        const {name, mimeType, sizeBytes, id} = data.docs[0];

                        const sizeError = lessThan40MB(sizeBytes);
                        if (sizeError) {
                            return onError && onError(sizeError);
                        }

                        if (GOOGLE_MIME_TYPES[mimeType]) {
                            const standardMimeType = GOOGLE_MIME_TYPES[mimeType];

                            this.exportPickedFile(
                                accessToken,
                                id,
                                standardMimeType,
                                this.getFileNameByMimeType(name, standardMimeType),
                                onPick,
                            );
                        } else {
                            this.downloadPickedFile(
                                accessToken,
                                id,
                                this.getFileNameByMimeType(name, mimeType),
                                onPick,
                            );
                        }
                    }
                });
            picker.build().setVisible(true);
        }
            //@ts-ignore
        catch (error: any) {
            onError && onError(error.message);
        }
    };

    private getFileNameByMimeType = (name: string, mimeType: string) => {
        const remoteFileExt = pathParse(name).ext;
        const fileName =
            remoteFileExt && Object.keys(MIME_TYPES).includes(remoteFileExt)
                ? name
                : `${name}${Object.keys(MIME_TYPES).find(key => MIME_TYPES[key] === mimeType)}`;

        return fileName;
    };

    private downloadPickedFile = async (
        accessToken: string,
        id: string,
        fileName: string,
        callback?: FileDownloadCallback,
    ) => {
        const res = await Axios.get(`${GOOGLE_DRIVE_API_URL}/files/${id}`, {
            params: {
                alt: 'media',
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'blob',
        });

        callback && callback(new File([res.data], fileName));
    };

    private exportPickedFile = async (
        accessToken: string,
        id,
        exportMimeType: string,
        fileName: string,
        callback?: FileDownloadCallback,
    ) => {
        const res = await Axios.get(`${GOOGLE_DRIVE_API_URL}/files/${id}/export`, {
            params: {
                alt: 'media',
                mimeType: exportMimeType,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'blob',
        });

        callback && callback(new File([res.data], fileName));
    };
}

export default new GoogleApi();
