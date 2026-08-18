import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddDish = () => {
    const [name, setName] = useState("");
    const [aliases, setAliases] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

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

    const handleIngredientChange = (e) => {
        const ingredientName = e.target.value;

        if (
            ingredientName &&
            !selectedIngredients.includes(ingredientName)
        ) {
            setSelectedIngredients([
                ...selectedIngredients,
                ingredientName
            ]);
        }
    };

    const removeIngredient = (ingredientName) => {
        setSelectedIngredients(
            selectedIngredients.filter(
                (item) => item !== ingredientName
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return toast.error("Dish name is required");
        }

        if (selectedIngredients.length === 0) {
            return toast.error("Select at least one ingredient");
        }

        try {
            const aliasesArray = aliases
                .split(",")
                .map((alias) => alias.trim())
                .filter((alias) => alias !== "");

            const { data } = await axios.post(
                "/api/seller/add-dish",
                {
                    name: name.trim(),
                    aliases: aliasesArray,
                    ingredientsName: selectedIngredients
                }
            );

            if (data.success) {
                toast.success(data.message);

                setName("");
                setAliases("");
                setSelectedIngredients([]);
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

                {/* Dish Name */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">
                        Dish Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter dish name"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                {/* Aliases */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">
                        Aliases
                    </label>

                    <input
                        type="text"
                        value={aliases}
                        onChange={(e) =>
                            setAliases(e.target.value)
                        }
                        placeholder="Pohe, Indori Poha, Kanda Poha"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    />

                    <p className="text-sm text-gray-500">
                        Separate aliases using commas
                    </p>
                </div>

                {/* Ingredient dropdown */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium">
                        Ingredients
                    </label>

                    <select
                        onChange={handleIngredientChange}
                        value=""
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                    >
                        <option value="">
                            Select Ingredient
                        </option>

                        {ingredients.map((ingredient) => (
                            <option
                                key={ingredient._id}
                                value={ingredient.name}
                            >
                                {ingredient.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selected Ingredients */}
                <div className="flex flex-wrap gap-2">
                    {selectedIngredients.map((ingredient) => (
                        <div
                            key={ingredient}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded"
                        >
                            <span>{ingredient}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    removeIngredient(ingredient)
                                }
                                className="text-red-500 font-medium"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary hover:bg-primary-dull text-white font-medium rounded"
                >
                    ADD DISH
                </button>

            </form>
        </div>
    );
};

export default AddDish;