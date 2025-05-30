import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Copy, Music, Lightbulb, Sparkles, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [generatedRhyme, setGeneratedRhyme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleGenerateRhyme = async () => {
    // Validação de entrada
    if (!inputText.trim()) {
      setError('Por favor, digite pelo menos uma palavra.');
      toast({
        title: "Atenção",
        description: "Por favor, digite pelo menos uma palavra para criar sua rima!",
        variant: "destructive",
      });
      return;
    }

    setError('');
    setIsLoading(true);
    setGeneratedRhyme('');

    try {
      console.log('Enviando requisição para API do n8n:', inputText);
      
      const response = await fetch('https://kennedy-torres.app.n8n.cloud/webhook-test/URLDOVIDEO', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          palavras: inputText.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      console.log('Resposta completa da API:', data);

      // Verificar se existe 'rima' ou 'output' na resposta
      const rhymeContent = data.rima || data.output;
      
      if (rhymeContent) {
        setGeneratedRhyme(rhymeContent);
        console.log('Rima extraída:', rhymeContent);
        toast({
          title: "Rima criada!",
          description: "Sua rima foi gerada com sucesso. Que tal compartilhar?",
        });
      } else {
        throw new Error('Resposta da API não contém rima nem output');
      }
    } catch (error) {
      console.error('Erro ao gerar rima:', error);
      setError('Ocorreu um erro e nossa IA tropeçou nos versos. Tente novamente!');
      toast({
        title: "Ops! Algo deu errado",
        description: "Nossa IA tropeçou nos versos. Tente novamente em alguns instantes!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedRhyme);
      toast({
        title: "Copiado!",
        description: "Sua rima foi copiada para a área de transferência.",
      });
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto. Tente selecionar e copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Elementos flutuantes de fundo */}
      <div className="floating-elements">
        <div className="floating-element">
          <Music size={60} className="text-purple-300" />
        </div>
        <div className="floating-element">
          <Lightbulb size={45} className="text-blue-300" />
        </div>
        <div className="floating-element">
          <Sparkles size={50} className="text-pink-300" />
        </div>
        <div className="floating-element">
          <Mic size={55} className="text-indigo-300" />
        </div>
      </div>

      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          {/* Título principal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6 leading-tight">
            <span className="gradient-text">Transforme Suas Palavras</span>
            <br />
            <span className="text-gray-800">em Rimas com IA</span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-gray-600 font-poppins font-light leading-relaxed max-w-3xl mx-auto">
            Diga adeus ao bloqueio criativo. Digite suas palavras-chave e deixe nossa 
            inteligência artificial criar a rima perfeita para sua música, poema ou post em segundos.
          </p>
        </div>

        {/* Card principal com o gerador */}
        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardContent className="p-8">
            {/* Campo de entrada */}
            <div className="space-y-4 mb-6">
              <label htmlFor="palavras-input" className="block text-lg font-semibold text-gray-800 font-montserrat">
                Digite as palavras que devem estar na rima:
              </label>
              <Textarea
                id="palavras-input"
                placeholder="Ex: noite, luar, mar, canção, coração"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 resize-none font-poppins"
                disabled={isLoading}
              />
              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}
            </div>

            {/* Botão de ação */}
            <Button
              onClick={handleGenerateRhyme}
              disabled={isLoading}
              className="gradient-button w-full text-white font-bold py-4 px-8 text-lg rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando sua rima...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Criar Rima!
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Área de resultado */}
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-blue-50 min-h-[200px] animate-fade-in">
            <CardContent className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                  <p className="text-lg text-gray-600 font-medium animate-pulse-slow">
                    Nossa IA está criando versos mágicos para você...
                  </p>
                </div>
              ) : generatedRhyme ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 font-montserrat">
                      Sua rima genial:
                    </h3>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="hover:bg-purple-100 transition-colors"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <div className="bg-white/70 rounded-lg p-6 border-l-4 border-purple-400">
                    <p className="text-lg leading-relaxed text-gray-800 font-poppins whitespace-pre-wrap">
                      {generatedRhyme}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-4 animate-bounce-gentle">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-lg text-gray-600 font-medium">
                    Sua rima genial aparecerá aqui...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Digite suas palavras-chave e clique em "Criar Rima!" para começar
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rodapé com dicas */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-gray-500 text-sm font-poppins">
            💡 Dica: Use palavras relacionadas ao tema da sua criação para obter rimas mais relevantes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
