import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import ProductCard from '../component/ProductCard';
import { assets } from '../assets/assets';

const benefits = [
    {
        title: "No more guessing ingredients",
        desc: "Search a dish and get every product you need to cook it, without hunting through categories one by one.",
        icon: assets.cart_icon,
    },
    {
        title: "Saves you time",
        desc: "One search adds an entire recipe's shopping list in seconds, instead of adding items one at a time.",
        icon: assets.cart_icon,
    },
    {
        title: "Never miss an ingredient",
        desc: "Our curated dish lists are put together so you don't forget that one spice or item halfway through cooking.",
        icon: assets.cart_icon,
    },
];

const SearchByDish = () => {
    const { axios } = useAppContext();
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const searchDishes = async (q) => {
        if (!q.trim()) {
            setItems([]);
            setSearched(false);
            setErrorMsg('');
            return;
        }
        setLoading(true);
        setSearched(true);
        setErrorMsg('');
        try {
            const { data } = await axios.get('/api/product/dish', {
                params: { dishName: q },
            });

            if (data.success) {
                setItems(data.items ?? []);
            } else {
                setItems([]);
                setErrorMsg(data.message || 'No products found for this dish.');
            }
        } catch (error) {
            console.error(error);
            setItems([]);
            setErrorMsg('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            searchDishes(query);
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="mt-10 mb-24">
            {/* Hero / Search */}
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-2xl md:text-4xl font-medium text-gray-700">
                    Search by <span className="text-primary-dull">Dish Name</span>
                </p>
                <p className="text-gray-500/60 mt-2 text-sm md:text-base">
                    Know what you want to cook? Just search the dish and we'll bring you everything you need to make it.
                </p>

                <div className="flex items-center mt-6 border border-gray-500/20 rounded-full px-4 py-2.5 md:py-3 focus-within:border-primary-dull transition">
                    <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-50" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Try 'Poha', 'Pasta', 'Paneer Butter Masala'..."
                        className="w-full outline-none px-3 text-sm md:text-base bg-transparent"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 text-sm px-1">
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="mt-10">
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                        {Array(5).fill('').map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-primary/10 animate-pulse" />
                                <div className="w-16 h-3 rounded bg-primary/10 animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && searched && items.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">{errorMsg || `No dishes found for "${query}"`}</p>
                        <p className="text-gray-400 text-sm mt-1">Try a different name, like "Poha" or "Sandwich".</p>
                    </div>
                )}

                {!loading && items.length > 0 && (
    <div className="mt-4 space-y-8">
        {Object.entries(
            items.reduce((groups, item) => {
                const key = item.ingredient_id.name || 'Other';
                if (!groups[key]) groups[key] = [];
                groups[key].push(item);
                return groups;
            }, {})
        ).map(([ingredient, groupItems]) => (
            <div key={ingredient}>
                <p className="text-lg md:text-xl font-medium text-gray-700 mb-4 pb-2 border-b border-gray-500/20">
                    {ingredient}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
                    {groupItems.map((item) => (
                        <ProductCard key={item._id} product={item} />
                    ))}
                </div>
            </div>
        ))}
    </div>
)}
            </div>

            {/* Benefits section */}
            <div className="mt-20">
                <p className="text-xl md:text-2xl font-medium text-gray-700 text-center">
                    Why search by <span className="text-primary-dull">dish name?</span>
                </p>
                <p className="text-gray-500/60 text-center text-sm md:text-base mt-1 max-w-xl mx-auto">
                    Cooking a specific dish shouldn't mean building your cart item by item. Here's how this helps.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {benefits.map((b, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-start gap-3 border border-gray-500/20 rounded-md p-5 hover:border-primary-dull transition bg-primary/5"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20">
                                <img src={b.icon} alt="" className="w-5 h-5" />
                            </div>
                            <p className="font-medium text-gray-700">{b.title}</p>
                            <p className="text-gray-500/60 text-sm">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchByDish;