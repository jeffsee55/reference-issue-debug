import { staticRequest } from "tinacms";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Layout } from "../components/Layout";
import { useTina } from "tinacms/dist/edit-state";

const query = `#graphql
query {
  # getColoursDocument(relativePath: "colour1.json") {
  #   data {
  #     rgbColour
  #   }
  # }
  getPagesDocument(relativePath: "page1.md") {
    id
    data {
      backgroundColourDropdown
      backgroundColourReference {
        ...on ColoursDocument {
          data {
             rgbColour
          }
        }
      }
    }
  }
}
`;

export default function Home(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query,
    variables: {},
    data: props.data,
  });
  console.log(data);

  const content = data.getPagesDocument.data;
  return <pre>{JSON.stringify(content, null, 2)}</pre>;
}

export const getStaticProps = async () => {
  const variables = {};
  let data = {};
  try {
    data = await staticRequest({
      query,
      variables,
    });
  } catch (e) {
    // swallow errors related to document creation
  }

  return {
    props: {
      data,
      //myOtherProp: 'some-other-data',
    },
  };
};
