export async function fetchVerificationPage(url){
    const response = await fetch(url);

    const contentType = response.headers.get("content-type");

    const body = await response.text();

    return{
        status:response.status,
        contentType,
        url: response.url,
        body
    };
}