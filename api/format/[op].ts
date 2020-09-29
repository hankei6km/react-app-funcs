import { NowRequest, NowResponse } from '@vercel/node';

export default (request: NowRequest, response: NowResponse) => {
    const { op, value } = request.query
    console.log(`format: op=${op}, value=${value}`);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
        switch (op) {
            case 'pad':
                response.status(200).json({
                    value: `${num}`.padStart(6, '0')
                });
                return
        }
    }
    response.status(500).json({
        message: 'bad request',
    });
}