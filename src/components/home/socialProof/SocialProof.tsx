import SimpleSection from '../../shared/SimpleSection';
import Testimonial from './Testimonial';

function SocialProof() {
  return (
    <SimpleSection>
      <div className="container mx-auto">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="section-grid">
          <Testimonial
            quote="The automation engineering course at our university equipped
              me with the necessary skills to excel in my career. HDL Flow
              played a crucial role in my project work, simplifying complex
              tasks and accelerating my learning curve."
            name="John Doe"
            role="Automation Engineering Graduate"
          />
          <Testimonial
            quote="As an automation engineering student, I found HDL Flow to be an
              invaluable tool for translating theoretical concepts into
              practical applications. It significantly enhanced my understanding
              of digital logic design."
            name="Jane Smith"
            role="Former Student"
          />
          <Testimonial
            quote="I highly recommend HDL Flow to my peers in the automation
              engineering program. It's user-friendly interface and powerful
              features make it an essential tool for any digital design
              project."
            name="Michael Johnson"
            role="Automation Engineering Student"
          />
        </div>
      </div>
    </SimpleSection>
  );
}

export default SocialProof;
