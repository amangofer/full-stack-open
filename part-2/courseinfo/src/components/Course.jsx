const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => <h3>Total of {sum} exercises</h3>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total sum={course.parts.reduce((acc, part) => acc + part.exercises, 0)} />
  </>
);

export default Course;
