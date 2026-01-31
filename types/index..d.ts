interface Message {
    action:'scan' | 'clear';
    attribute?:string;
    mode?:'with' | 'missing';
}

interface ScanResponse {
    success:boolean;
    count?:number;
    error?:string;
}
