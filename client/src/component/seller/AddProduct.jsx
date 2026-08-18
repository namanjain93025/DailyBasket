import React, { useEffect, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const [price, setPrice] = useState("");
    const [ingredient, setIngredient] = useState("");
    const [ingredients, setIngredients] = useState([]);

    const { axios } = useAppContext();

    const fetchIngredients = async () => {
        try {
            const { data } = await axios.get(
                "/api/seller/fetch-all-ingridient"
            );

            if (data.success) {
                setIngredients(data.ingredients);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            if (!ingredient) {
                return toast.error("Please select an ingredient");
            }

            const productData = {
                name,
                description: description.split("\n"),
                category,
                price,
                offerPrice,
                ingredient,
            };

            const formData = new FormData();

            formData.append(
                "productData",
                JSON.stringify(productData)
            );

            for (let i = 0; i < files.length; i++) {
                if (files[i]) {
                    formData.append("images", files[i]);
                }
            }

            const { data } = await axios.post(
                "/api/product/add",
                formData
            );

            if (data.success) {
                toast.success(data.message);

                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setIngredient("");
                setFiles([]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="no-scrollbar py-10 flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">

            <form
                onSubmit={onSubmitHandler}
                className="md:p-10 p-4 space-y-5 max-w-lg"
            >

                {/* Product Images */}
                <div>
                    <p className="text-base font-medium">
                        Product Image
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2">

                        {Array(4)
                            .fill("")
                            .map((_, index) => (

                                <label
                                    key={index}
                                    htmlFor={`image${index}`}
                                >

                                    <input
                                        onChange={(e) => {
                                            const updatedFiles = [
                                                ...files
                                            ];

                                            updatedFiles[index] =
                                                e.target.files[0];

                                            setFiles(updatedFiles);
                                        }}
                                        type="file"
                                        id={`image${index}`}
                                        hidden
                                    />

                                    <img
                                        className="max-w-24 cursor-pointer"
                                        src={
                                            files[index]
                                                ? URL.createObjectURL(
                                                      files[index]
                                                  )
                                                : assets.upload_area
                                        }
                                        alt="upload area"
                                    />

                                </label>
                            ))}
                    </div>
                </div>

                {/* Product Name */}
                <div className="flex flex-col gap-1 max-w-md">

                    <label
                        className="text-base font-medium"
                        htmlFor="product-name"
                    >
                        Product Name
                    </label>

                    <input
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        value={name}
                        id="product-name"
                        type="text"
                        placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />

                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 max-w-md">

                    <label
                        className="text-base font-medium"
                        htmlFor="product-description"
                    >
                        Product Description
                    </label>

                    <textarea
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        value={description}
                        id="product-description"
                        rows={4}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Type here"
                    />

                </div>

                {/* Category */}
                <div className="w-full flex flex-col gap-1">

                    <label
                        className="text-base font-medium"
                        htmlFor="category"
                    >
                        Category
                    </label>

                    <select
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        value={category}
                        id="category"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((item, index) => (
                            <option
                                value={item.path}
                                key={index}
                            >
                                {item.path}
                            </option>
                        ))}

                    </select>
                </div>

                {/* Ingredient */}
                <div className="w-full flex flex-col gap-1">

                    <label
                        className="text-base font-medium"
                        htmlFor="ingredient"
                    >
                        Ingredient
                    </label>

                    <select
                        onChange={(e) =>
                            setIngredient(e.target.value)
                        }
                        value={ingredient}
                        id="ingredient"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    >

                        <option value="">
                            Select Ingredient
                        </option>

                        {ingredients.map((item) => (
                            <option
                                value={item._id}
                                key={item._id}
                            >
                                {item.name}
                            </option>
                        ))}

                    </select>
                </div>

                {/* Price */}
                <div className="flex items-center gap-5 flex-wrap">

                    <div className="flex-1 flex flex-col gap-1 w-32">

                        <label
                            className="text-base font-medium"
                            htmlFor="product-price"
                        >
                            Product Price
                        </label>

                        <input
                            onChange={(e) =>
                                setPrice(e.target.value)
                            }
                            value={price}
                            id="product-price"
                            type="number"
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />

                    </div>

                    {/* Offer Price */}
                    <div className="flex-1 flex flex-col gap-1 w-32">

                        <label
                            className="text-base font-medium"
                            htmlFor="offer-price"
                        >
                            Offer Price
                        </label>

                        <input
                            onChange={(e) =>
                                setOfferPrice(e.target.value)
                            }
                            value={offerPrice}
                            id="offer-price"
                            type="number"
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />

                    </div>
                </div>

                <button className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white font-medium rounded">
                    ADD
                </button>

            </form>

        </div>
    );
};

export default AddProduct;