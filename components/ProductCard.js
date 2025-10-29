import React from "react";

const ProductCard = ({ product, onStyleRequest }) => {
  const handleStyleClick = (e) => {
    e.preventDefault();
    onStyleRequest(product.id, product.name);
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    alert(`Demo: Clicked on ${product.name}`);
  };

  return (
    <div className="product-card flex-shrink-0 w-48 border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600">{product.price}</p>
        <a
          href="#"
          onClick={handleViewClick}
          className="text-center block w-full bg-gray-100 text-gray-800 text-sm font-medium py-1.5 rounded-md hover:bg-gray-200"
        >
          View Details
        </a>
        <a
          href="#"
          onClick={handleStyleClick}
          className="text-center block w-full bg-gray-900 text-white text-sm font-medium py-1.5 rounded-md hover:bg-gray-700"
        >
          ✨ Style this
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
