import { BrowserQRCodeReader } from "@zxing/browser";

const codeReader = new BrowserQRCodeReader();

export async function detectQRCode(imageUrl){
    try{
        const result = await codeReader.decodeFromImageUrl(imageUrl);

        return {
            found: true,
            data: result.getText()
        };
    }catch(error){
        return {
            found: false,
            data: null
        };
    }
}