interface Props {
  quote: string;
  name: string;
  role: string;
}

function Testimonial({quote, name, role}: Props) {
  return (
    <div className="simple-card">
      <blockquote className="text-gray-700 mb-4">
        &quot;{quote}&quot;
      </blockquote>
      <cite className="block text-gray-600">
        - {name}, {role}
      </cite>
    </div>
  );
}

export default Testimonial;
