import React, { useState } from "react";

type ParamType = "string"; // При необходимости можно добавить другие типы параметров

interface Param {
  id: number;
  name: string;
  type: ParamType;
  // availableValues?: string[]; Если будет необходимость в параметре со списком значений
}

type ParamValueType = string | number;

interface ParamValue {
  paramId: number;
  value: ParamValueType;
}

interface Model {
  paramValues: ParamValue[];
}

const params: Param[] = [
  {
    id: 1,
    name: "Назначение",
    type: "string",
  },
  {
    id: 2,
    name: "Длина",
    type: "string",
  },
];

const model: Model = {
  paramValues: [
    {
      paramId: 1,
      value: "повседневное",
    },
    {
      paramId: 2,
      value: "макси",
    },
  ],
};

interface ModelEditorProps {
  model: Model;
  params: Param[];
}

const getModelParams = (model: Model) => {
  const { paramValues } = model;

  // При помощи Map гарантируем порядок полей
  return new Map(
    paramValues.map(paramValue => [paramValue.paramId, paramValue.value])
  );
};

const useModelEditor = (model: Model) => {
  const [paramValues, setParamValues] = useState(getModelParams(model));

  const changeParamValue = (paramId: number, value: ParamValueType) => {
    setParamValues(oldValue => new Map(oldValue).set(paramId, value));
  };

  const getModel = (): Model => {
    return {
      paramValues: [...paramValues].map<ParamValue>(([paramId, value]) => {
        return { paramId, value };
      }),
    };
  };

  return {
    paramValues: getModel().paramValues,
    changeParamValue,
    getModel,
  };
};

const getParamById = (paramId: number): Param | undefined => {
  return params.find(param => param.id === paramId);
};

interface ParamEditorProps {
  paramValue: ParamValue;
  onChange: (paramId: number, value: ParamValueType) => void;
}

const ParamEditor: React.FC<ParamEditorProps> = ({ paramValue, onChange }) => {
  const { paramId, value } = paramValue;

  const param = getParamById(paramId);

  if (!param) {
    return null;
  }

  const { type, name } = param;

  let control = null;

  switch (type) {
    // Реализация других типов параметров
    case "string":
      control = (
        <input
          type="text"
          value={value}
          onChange={event => onChange(paramId, event.target.value)}
        />
      );
      break;

    default:
      control = null;
      break;
  }

  if (!control) {
    return null;
  }

  return (
    <div>
      <label>
        {name}
        {control}
      </label>
    </div>
  );
};

const ModelEditor: React.FC<ModelEditorProps> = ({ model }) => {
  const { paramValues, changeParamValue, getModel } = useModelEditor(model);

  const handleButtonClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(getModel());
  };

  return (
    <form onSubmit={handleButtonClick} className="model-editor">
      {paramValues.map(param => {
        return (
          <ParamEditor
            paramValue={param}
            key={param.paramId}
            onChange={changeParamValue}
          />
        );
      })}

      <button>get model</button>
    </form>
  );
};

const App = () => {
  return (
    <div className="models">
      <ModelEditor params={params} model={model} />
    </div>
  );
};

export default App;
