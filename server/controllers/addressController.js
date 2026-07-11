import { Address } from '../models/address.js';


// Add Address  : /api/address/add

export const addAddress = async (req, res) => {
    try {
        const { address, userId } = req.body;
        console.log("address is ",address);
        if(address.phone.length!==10){
            return res.json({ 
                success : false,
                message : 'Enter valid Mobile Number',
            })
        }
        await Address.create({ ...address, userId })
        return res.json({ success: true, message: 'Addresss added successfully' });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
//Get Address : /api/address/get

export const getAddress = async (req, res) => {
    try {

        const { userId } = req
        // console.log("in getAddress function - ",userId);
        const addresses = await Address.find({ userId })
        return res.json({ success: true, addresses, message: 'Address added sucessfully ' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}