import "./CategoryPills.css";

const categories = [
  "Technology",
  "Business",
  "Entertainment",
  "Health",
  "Science",
  "Sports",

];

const CategoryPills = ({ category, setCategory }) => {
  return (
    <div className="category-pills">
      {categories.map((item) => (
        <button
          key={item}
          className={`category-pill ${
            category === item.toLowerCase() ? "active" : ""
          }`}
          onClick={() => setCategory(item.toLowerCase())}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;