import { $cms } from "@jx3box/jx3box-common/js/api";

// 上传
function uploadFacedata(formdata) {
    return $cms().post("/api/cms/upload/facedata", formdata);
}

export { uploadFacedata };
