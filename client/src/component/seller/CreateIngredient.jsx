import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const createIngredient = () => {
    const [name, setName] = useState("");
    const { axios } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return toast.error("Enter ingredient name");
        }

        try {
            const { data } = await axios.post(
                "/api/seller/create-ingrdient",
                {
                    name: name.trim()
                }
            );

            if (data.success) {
                toast.success(data.message);
                setName("");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="py-10 flex-1">
            <form
                onSubmit={handleSubmit}
                className="md:p-10 p-4 space-y-5 max-w-lg"
            >
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="ingredient-name"
                        className="text-base font-medium"
                    >
                        Ingredient Name
                    </label>

                    <input
                        id="ingredient-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter ingredient name"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white font-medium rounded"
                >
                    ADD INGREDIENT
                </button>
            </form>
        </div>
    );
};

export default createIngredient;