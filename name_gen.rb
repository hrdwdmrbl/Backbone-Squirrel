class Funky
  def initialize
    if !defined?( @@random_device)
      if File.exists? "/dev/urandom"
        @@random_device = File.open "/dev/urandom", "r"
      elsif File.exists? "/dev/random"
        @@random_device = File.open "/dev/random", "r"
      else
        raise RuntimeError, "Can't find random device"
      end
    end
  end
  def test_for_unix_randomness
    while true
      word = @@random_device.read(16).unpack("h8 h4 h4 h4 h12").join "-"
      ending = word.split('').values_at(-2,-1).join
      puts ending
      if ['in','uk','us','me','co','ca','es','pe','tv','cc'].include? ending
        puts word
        break
      end
    end
  end
  def failing_test_for_unix_randomness
    while true
      word = @@random_device.read(16).unpack("h8 h4 h4 h4 h12").join "-"
      ending = word.split('').values_at(-2,-1).join
      puts ending
      if ['us','me','es'].include? ending
        puts word
        break
      end
    end
  end
end