import User from "../models/user.js"

//update User CartData : /api/cart/update

export const updateCart = async (req, res) => {
    try {

        const { userId, cartItems } = req.body

        const user = await User.findByIdAndUpdate(userId, { cartItems })

        return res.json({ success: true, message: 'cart updated', user })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}