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

  // Função para processar texto e converter **texto** em negrito
  const formatTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-bold text-purple-700">{boldText}</strong>;
      }
      return part;
    });
  };

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Elementos flutuantes de fundo - mais musicais */}
      <div className="floating-elements">
        <div className="floating-element">
          <Music size={60} className="text-yellow-300/30" />
        </div>
        <div className="floating-element">
          <Music size={45} className="text-pink-300/20" />
        </div>
        <div className="floating-element">
          <Mic size={50} className="text-blue-300/25" />
        </div>
        <div className="floating-element">
          <Music size={55} className="text-purple-300/30" />
        </div>
        <div className="floating-element">
          <Mic size={40} className="text-yellow-300/20" />
        </div>
      </div>

      {/* Notas musicais animadas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="music-note-1">♪</div>
        <div className="music-note-2">♫</div>
        <div className="music-note-3">♪</div>
        <div className="music-note-4">♫</div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          {/* Título principal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Transforme Suas Palavras
            </span>
            <br />
            <span className="text-white">em Rimas com IA</span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-purple-100 font-poppins font-light leading-relaxed max-w-3xl mx-auto">
            Diga adeus ao bloqueio criativo. Digite suas palavras-chave e deixe nossa 
            inteligência artificial criar a rima perfeita para sua música, poema ou post em segundos.
          </p>
        </div>

        {/* Card principal com o gerador */}
        <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-md animate-scale-in">
          <CardContent className="p-8">
            {/* Campo de entrada */}
            <div className="space-y-4 mb-6">
              <label htmlFor="palavras-input" className="block text-lg font-semibold text-gray-800 font-montserrat flex items-center gap-2">
                <Music className="h-5 w-5 text-purple-600" />
                Digite as palavras que devem estar na rima:
              </label>
              <Textarea
                id="palavras-input"
                placeholder="Ex: noite, luar, mar, canção, coração"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] text-lg p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 resize-none font-poppins"
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full text-white font-bold py-4 px-8 text-lg rounded-xl font-montserrat shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando sua rima...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-5 w-5" />
                  Criar Rima!
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Área de resultado */}
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md min-h-[200px] animate-fade-in">
            <CardContent className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
                    <Music className="h-6 w-6 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-lg text-gray-600 font-medium animate-pulse-slow">
                    Nossa IA está criando versos mágicos para você...
                  </p>
                </div>
              ) : generatedRhyme ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 font-montserrat flex items-center gap-2">
                      <Music className="h-5 w-5 text-purple-600" />
                      Sua rima genial:
                    </h3>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="hover:bg-purple-100 transition-colors border-purple-200"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <div className="bg-white/80 rounded-lg p-6 border-l-4 border-purple-500 shadow-inner">
                    <p className="text-lg leading-relaxed text-gray-800 font-poppins whitespace-pre-wrap">
                      {formatTextWithBold(generatedRhyme)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 animate-bounce-gentle">
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
          <p className="text-purple-200 text-sm font-poppins flex items-center justify-center gap-2">
            <Music className="h-4 w-4" />
            💡 Dica: Use palavras relacionadas ao tema da sua criação para obter rimas mais relevantes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
