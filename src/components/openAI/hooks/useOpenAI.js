import useUser from "plugins/account/hooks/user"; //this is related to CP
import { availableLanguages } from "plugins/general/config/language"; //this is related to CP
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useApi } from "/hooks"; //this is related to CP

const useOpenAI = () => {
  const dispatch = useDispatch();
  const { apiCore: api, generateToken, setGenerateToken } = useApi();
  const { id, collection: tmpCollection } = useParams();
  const collection = tmpCollection || "persona";

  const { usedTokens, totalUsedTokens, monthlyTokens } = useSelector(
    (state) => state["openAIReducer"]
  );

  const contentState = useSelector((state) => state["contentReducer"]);
  const topicsState = useSelector((state) => state["topicsReducer"]);
  const { topics, topicsLoading } = topicsState;

  const {
    contentItem: { content_id = {} },
  } = contentState;
  const { language = {} } = content_id;
  const { short = "de" } = language;
  const { user } = useUser();
  const { default_content_language } = user;
  const currentLanguage = availableLanguages.find((l) => l.short === short);
  const aiFeatures = currentLanguage.ai;

  const updateTracking = (tokenUsage) => {
    dispatch({
      type: "openAI/updateFields",
      payload: {
        usedTokens: tokenUsage.used_tokens,
        totalUsedTokens: tokenUsage.total_used_tokens.count,
        monthlyTokens: tokenUsage.monthly_tokens,
        remainingTokens: Math.max(
          0,
          tokenUsage.monthly_tokens - tokenUsage.total_used_tokens.count
        ),
      },
    });
  };
  const setGroup = (group) => {
    dispatch({
      type: "openAI/updateFields",
      payload: { group },
    });
  };

  async function getTokenUsage() {
    try {
      const { data } = await api.get(
        `${process.env.REACT_APP_API_URL}/openAI/tokenUsage/${collection}/${id}`
      );
      const {
        used_tokens: usedTokens,
        total_used_tokens: { count: totalUsedTokens },
        monthly_tokens: monthlyTokens,
      } = data;

      dispatch({
        type: "openAI/updateFields",
        payload: {
          usedTokens,
          totalUsedTokens,
          monthlyTokens,
          remainingTokens: monthlyTokens - totalUsedTokens,
        },
      });
    } catch (error) {
      console.log("getTokenusage error", error);
    }
  }

  const setTopics = (value) => {
    dispatch({
      type: "topics/setTopics",
      payload: value,
    });
  };

  const setTopicsLoading = (value) => {
    dispatch({
      type: "topics/setTopicsLoading",
      payload: value,
    });
  };
  const resetTopics = () => {
    setTopics([]);
  };
  const handleLoadingChange = (value) => {
    setTopicsLoading(value);
    setGenerateToken(false);
  };
  async function generateTopics(
    personaId,
    orgId,
    count,
    companyDescription,
    goal,
    options,
    style
  ) {
    const defaultLanguage = default_content_language?.short || "de";
    const languageName = availableLanguages.find(
      (l) => l.short === defaultLanguage
    ).name;
    try {
      setTopicsLoading(true);
      const { data } = await api.post(
        `${process.env.REACT_APP_API_URL}/openAI/generateTopics`,
        {
          personaId,
          orgId,
          count,
          companyDescription,
          goal,
          language: defaultLanguage,
          options,
          style,
          languageName,
        },
        false,
        generateToken.token
      );
      updateTracking(data.tokenUsage);
      setGroup(
        data.tokenUsage.group ? data.tokenUsage.group : data.tokenUsage.id
      );
      generateToken.cancel();
      if (data.result) {
        const adjustedTopics = [
          ...topics,
          ...JSON.parse(
            `{"result": ${data.result[0].message.content}}`
          ).result.map((topic) => {
            return { ...topic, selected: false };
          }),
        ];
        setTopics(adjustedTopics);
        setTopicsLoading(false);
        setGenerateToken(false);
      } else {
        generateTopics(
          personaId,
          orgId,
          count,
          companyDescription,
          goal,
          options,
          style,
          languageName
        );
      }
    } catch (error) {
      console.log("generateTopics error", error);
      if (error.message?.includes("JSON")) {
        generateTopics(
          personaId,
          orgId,
          count,
          companyDescription,
          goal,
          options,
          style,
          languageName
        );
      }
    }
  }
  const languageAvailable = ["de", "en"].includes(short);

  return {
    usedTokens,
    totalUsedTokens,
    monthlyTokens,
    getTokenUsage,
    generateTopics,
    topics,
    resetTopics,
    setTopics,
    topicsLoading,
    generateToken,
    handleLoadingChange,
    languageAvailable,
    aiFeatures,
  };
};

export default useOpenAI;
